const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { exec } = require('child_process');
const osu = require('node-os-utils');
const si = require('systeminformation');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('Client connected');

  // Send initial system information
  sendSystemInfo(socket);

  // Handle command execution
  socket.on('execute-command', (command) => {
    console.log(`Executing command: ${command}`);
    
    // Android compatibility - security restrictions
    const isRiskCommand = command.includes('rm ') || 
                          command.includes('format') || 
                          command.includes('deltree') ||
                          command.includes(':') && (command.includes('Program Files') || 
                                                  command.includes('Windows') || 
                                                  command.includes('System32'));
    
    if (isRiskCommand) {
      socket.emit('command-result', {
        output: 'This command is restricted for security reasons when accessing from mobile devices.',
        error: 'Command execution restricted'
      });
      return;
    }
    
    exec(command, (error, stdout, stderr) => {
      socket.emit('command-result', {
        output: stdout || stderr,
        error: error ? error.message : null
      });
    });
  });

  // Handle screenshot request
  socket.on('take-screenshot', () => {
    si.graphics()
      .then(data => {
        socket.emit('screenshot-result', {
          message: 'Screenshot functionality would capture screen here',
          displays: data.displays
        });
      })
      .catch(error => {
        socket.emit('screenshot-result', { error: error.message });
      });
  });

  // Handle system monitoring
  socket.on('monitor-system', () => {
    const monitoringInterval = setInterval(async () => {
      try {
        const cpuUsage = await osu.cpu.usage();
        const memUsage = await osu.mem.info();
        
        socket.emit('system-stats', {
          cpu: cpuUsage,
          memory: memUsage,
          uptime: os.uptime()
        });
      } catch (error) {
        console.error('Error getting system stats:', error);
      }
    }, 2000);

    socket.on('disconnect', () => {
      clearInterval(monitoringInterval);
    });
  });

  // Handle file system operations
  socket.on('list-directory', (dir) => {
    const directory = dir || '.';
    
    fs.readdir(directory, { withFileTypes: true }, (error, items) => {
      if (error) {
        socket.emit('directory-list', {
          path: directory,
          content: `Unable to read directory: ${directory}`,
          error: error.message
        });
        return;
      }
      
      const files = items.map(item => {
        const itemType = item.isDirectory() ? 'Directory' : 'File';
        return `${itemType}\t${item.name}`;
      });
      
      const header = `Directory listing of: ${directory}\n`;
      const content = header + "------------------------\n" + files.join('\n');
      
      socket.emit('directory-list', {
        path: directory,
        content: content,
        error: null
      });
    });
  });

  // Process listesi
  socket.on('list-processes', () => {
    const command = os.platform() === 'win32' ? 'tasklist' : 'ps aux';
    exec(command, (error, stdout, stderr) => {
      socket.emit('process-list', {
        content: stdout || stderr,
        error: error ? error.message : null
      });
    });
  });

  // Process sonlandırma
  socket.on('kill-process', (pid) => {
    if (!pid) {
      socket.emit('process-kill-result', {
        success: false,
        error: 'No process ID provided'
      });
      return;
    }

    const command = os.platform() === 'win32' ? `taskkill /F /PID ${pid}` : `kill -9 ${pid}`;
    exec(command, (error, stdout, stderr) => {
      socket.emit('process-kill-result', {
        success: !error,
        output: stdout || stderr,
        error: error ? error.message : null
      });
    });
  });

  // Ağ taraması
  socket.on('scan-network', () => {
    const command = os.platform() === 'win32' ? 'arp -a' : 'arp -n';
    exec(command, (error, stdout, stderr) => {
      socket.emit('network-scan-result', {
        content: stdout || stderr,
        error: error ? error.message : null
      });
    });
  });

  // Windows Registry okuma (Sadece Windows için)
  socket.on('read-registry', (path) => {
    if (os.platform() !== 'win32') {
      socket.emit('registry-read-result', {
        error: 'Registry operations are only available on Windows systems'
      });
      return;
    }

    if (!path) {
      socket.emit('registry-read-result', {
        error: 'No registry path provided'
      });
      return;
    }

    exec(`reg query "${path}"`, (error, stdout, stderr) => {
      socket.emit('registry-read-result', {
        content: stdout || stderr,
        error: error ? error.message : null
      });
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Function to send system information
async function sendSystemInfo(socket) {
  try {
    const [cpu, mem, osInfo, network, system, graphics, disk, battery, bios, baseboard, chassis] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.osInfo(),
      si.networkInterfaces(),
      si.system(),
      si.graphics(),
      si.diskLayout(),
      si.battery(),
      si.bios(),
      si.baseboard(),
      si.chassis()
    ]);

    // Get drive space info
    const fsSize = await si.fsSize();

    // Get current processes count
    const processCount = await si.processes().then(data => data.all);

    // Get current user info
    const users = await si.users();

    socket.emit('system-info', {
      cpu: {
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        cores: cpu.cores,
        physicalCores: cpu.physicalCores,
        speed: cpu.speed,
        speedMax: cpu.speedMax,
        cache: cpu.cache,
        governor: cpu.governor
      },
      memory: {
        total: mem.total,
        free: mem.free,
        used: mem.used,
        swapTotal: mem.swaptotal,
        swapUsed: mem.swapused
      },
      os: {
        platform: osInfo.platform,
        distro: osInfo.distro,
        release: osInfo.release,
        codename: osInfo.codename,
        kernel: osInfo.kernel,
        arch: osInfo.arch,
        hostname: osInfo.hostname,
        logofile: osInfo.logofile,
        serial: osInfo.serial,
        build: osInfo.build
      },
      network: network,
      system: {
        manufacturer: system.manufacturer,
        model: system.model,
        version: system.version,
        serial: system.serial,
        uuid: system.uuid
      },
      graphics: {
        controllers: graphics.controllers,
        displays: graphics.displays
      },
      storage: disk.map(drive => ({
        name: drive.name,
        type: drive.type,
        size: drive.size,
        vendor: drive.vendor,
        model: drive.model,
        serial: drive.serial,
        interface: drive.interfaceType
      })),
      filesystem: fsSize.map(fs => ({
        fs: fs.fs,
        type: fs.type,
        size: fs.size,
        used: fs.used,
        available: fs.available,
        mountpoint: fs.mount
      })),
      battery: {
        hasBattery: battery.hasbattery,
        isCharging: battery.ischarging,
        percent: battery.percent,
        timeRemaining: battery.timeremaining
      },
      bios: {
        vendor: bios.vendor,
        version: bios.version,
        releaseDate: bios.releaseDate,
        revision: bios.revision
      },
      baseboard: {
        manufacturer: baseboard.manufacturer,
        model: baseboard.model,
        version: baseboard.version,
        serial: baseboard.serial
      },
      chassis: {
        manufacturer: chassis.manufacturer,
        model: chassis.model,
        type: chassis.type,
        version: chassis.version,
        serial: chassis.serial
      },
      currentUser: users.length > 0 ? users[0].user : 'Unknown',
      processCount: processCount
    });
  } catch (error) {
    console.error('Error getting system info:', error);
    socket.emit('system-info', { error: error.message });
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
// Listen on all network interfaces (not just localhost) to allow external connections
server.listen(PORT, '0.0.0.0', () => {
  console.log(`FenoWAT server running on port ${PORT}`);
  
  // Get local IP addresses to display connection options
  const networkInterfaces = os.networkInterfaces();
  console.log('Available access points:');
  console.log(`- Local: http://localhost:${PORT}`);
  
  // List all IP addresses from network interfaces and generate QR codes
  Object.keys(networkInterfaces).forEach(interfaceName => {
    const interfaces = networkInterfaces[interfaceName];
    interfaces.forEach(iface => {
      // Skip internal/loopback/IPv6 addresses
      if (!iface.internal && iface.family === 'IPv4') {
        const url = `http://${iface.address}:${PORT}`;
        console.log(`- Network: ${url} (${interfaceName})`);
        
        // Generate QR code for Android devices to easily connect
        QRCode.toString(url, {type: 'terminal'}, (err, qrCode) => {
          if (!err) {
            console.log('\nScan this QR code on your Android device to connect:');
            console.log(qrCode);
          }
        });
      }
    });
  });
  
  console.log('To access from Android device, use one of the Network URLs above or scan the QR code.');
}); 