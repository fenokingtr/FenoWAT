// Connect to the socket.io server
const socket = io();

// DOM elements
const connectionStatus = document.getElementById('connection-status');
const systemInfoContent = document.getElementById('system-info-content');
const commandInput = document.getElementById('command-input');
const executeCommandBtn = document.getElementById('execute-command');
const commandOutput = document.getElementById('command-output');
const directoryInput = document.getElementById('directory-input');
const listDirectoryBtn = document.getElementById('list-directory');
const directoryOutput = document.getElementById('directory-output');
const takeScreenshotBtn = document.getElementById('take-screenshot');
const screenshotResult = document.getElementById('screenshot-result');
const startMonitoringBtn = document.getElementById('start-monitoring');
const statsContainer = document.querySelector('.stats-container');
const cpuBar = document.getElementById('cpu-bar');
const cpuUsage = document.getElementById('cpu-usage');
const memoryBar = document.getElementById('memory-bar');
const memoryUsage = document.getElementById('memory-usage');
const uptime = document.getElementById('uptime');

// Yeni eklenen özellikler için DOM elements
const listProcessesBtn = document.getElementById('list-processes');
const processOutput = document.getElementById('process-output');
const processIdInput = document.getElementById('process-id');
const killProcessBtn = document.getElementById('kill-process');
const scanNetworkBtn = document.getElementById('scan-network');
const networkOutput = document.getElementById('network-output');
const registryPathInput = document.getElementById('registry-path');
const readRegistryBtn = document.getElementById('read-registry');
const registryOutput = document.getElementById('registry-output');

// Connection events
socket.on('connect', () => {
    connectionStatus.textContent = 'Connected';
    connectionStatus.classList.add('connected');
    connectionStatus.classList.remove('disconnected');
});

socket.on('disconnect', () => {
    connectionStatus.textContent = 'Disconnected';
    connectionStatus.classList.add('disconnected');
    connectionStatus.classList.remove('connected');
});

// System information handler
socket.on('system-info', (data) => {
    if (data.error) {
        systemInfoContent.innerHTML = `<div class="error">Error: ${data.error}</div>`;
        return;
    }

    const { cpu, memory, os, network, system, graphics, storage, filesystem, battery, bios, baseboard, chassis, currentUser, processCount } = data;
    
    // Sekmeleri oluşturma
    let html = `
        <div class="info-tabs">
            <button class="tab-button active" data-tab="general">Genel</button>
            <button class="tab-button" data-tab="hardware">Donanım</button>
            <button class="tab-button" data-tab="storage">Depolama</button>
            <button class="tab-button" data-tab="network">Ağ</button>
            <button class="tab-button" data-tab="details">Detaylar</button>
        </div>
        <div class="tab-content">
    `;
    
    // Null, undefined veya boş değerler için kontrol fonksiyonu
    const formatValue = (value, defaultValue = 'Bilgi Alınamadı') => {
        if (value === null || value === undefined || value === '' || value === 'N/A') {
            return defaultValue;
        }
        return value;
    };

    // Nesne varlığını kontrol etme fonksiyonu
    const safeObject = (obj) => {
        return obj || {};
    };
    
    // Genel Bilgiler Tab
    html += `
        <div class="tab-pane active" id="general">
            <h3>İşletim Sistemi</h3>
            <div><strong>Platform:</strong> ${formatValue(safeObject(os).platform)} - ${formatValue(safeObject(os).distro)} ${formatValue(safeObject(os).release)}</div>
            <div><strong>Kernel:</strong> ${formatValue(safeObject(os).kernel)}</div>
            <div><strong>Mimari:</strong> ${formatValue(safeObject(os).arch)}</div>
            <div><strong>Bilgisayar adı:</strong> ${formatValue(safeObject(os).hostname)}</div>
            <div><strong>Aktif kullanıcı:</strong> ${formatValue(currentUser)}</div>
            <div><strong>Çalışan işlem sayısı:</strong> ${formatValue(processCount, '0')}</div>
            
            <h3>CPU</h3>
            <div><strong>Model:</strong> ${formatValue(safeObject(cpu).manufacturer)} ${formatValue(safeObject(cpu).brand)}</div>
            <div><strong>Fiziksel çekirdek:</strong> ${formatValue(safeObject(cpu).physicalCores, '0')} / <strong>Mantıksal çekirdek:</strong> ${formatValue(safeObject(cpu).cores, '0')}</div>
            <div><strong>Hız:</strong> ${formatValue(safeObject(cpu).speed, '0')} GHz / <strong>Max Hız:</strong> ${formatValue(safeObject(cpu).speedMax || safeObject(cpu).speed, '0')} GHz</div>
            <div><strong>Governör:</strong> ${formatValue(safeObject(cpu).governor)}</div>

            <h3>Bellek</h3>
            <div><strong>Toplam:</strong> ${formatBytes(safeObject(memory).total)}</div>
            <div><strong>Kullanılan:</strong> ${formatBytes(safeObject(memory).used)} (${
                safeObject(memory).total && safeObject(memory).used 
                ? Math.round((memory.used / memory.total) * 100) 
                : 0
            }%)</div>
            <div><strong>Boş:</strong> ${formatBytes(safeObject(memory).free)}</div>
            
            <h3>Sistem</h3>
            <div><strong>Üretici:</strong> ${formatValue(safeObject(system).manufacturer)}</div>
            <div><strong>Model:</strong> ${formatValue(safeObject(system).model)}</div>
            <div><strong>Sürüm:</strong> ${formatValue(safeObject(system).version)}</div>
        </div>
    `;
    
    // Donanım Bilgileri Tab
    html += `
        <div class="tab-pane" id="hardware">
            <h3>Anakart</h3>
            <div><strong>Üretici:</strong> ${formatValue(safeObject(baseboard).manufacturer)}</div>
            <div><strong>Model:</strong> ${formatValue(safeObject(baseboard).model)}</div>
            <div><strong>Sürüm:</strong> ${formatValue(safeObject(baseboard).version)}</div>
            <div><strong>Seri No:</strong> ${formatValue(safeObject(baseboard).serial)}</div>

            <h3>BIOS</h3>
            <div><strong>Üretici:</strong> ${formatValue(safeObject(bios).vendor)}</div>
            <div><strong>Sürüm:</strong> ${formatValue(safeObject(bios).version)}</div>
            <div><strong>Tarih:</strong> ${formatValue(safeObject(bios).releaseDate)}</div>

            <h3>Şasi</h3>
            <div><strong>Üretici:</strong> ${formatValue(safeObject(chassis).manufacturer)}</div>
            <div><strong>Model:</strong> ${formatValue(safeObject(chassis).model)}</div>
            <div><strong>Tip:</strong> ${formatValue(safeObject(chassis).type)}</div>
            
            <h3>Batarya</h3>
            ${safeObject(battery).hasBattery ? 
                `<div><strong>Şarj:</strong> ${formatValue(battery.percent, '0')}%</div>
                 <div><strong>Şarj oluyor:</strong> ${battery.isCharging ? 'Evet' : 'Hayır'}</div>
                 <div><strong>Kalan süre:</strong> ${
                     battery.timeRemaining > 0 
                     ? Math.floor(battery.timeRemaining / 60) + ' dakika' 
                     : 'Hesaplanamadı'
                 }</div>` 
                : '<div>Batarya bulunamadı</div>'}
                
            <h3>Ekran Kartları</h3>
            ${Array.isArray(safeObject(graphics).controllers) && graphics.controllers.length > 0 ?
                graphics.controllers.map((gpu, index) => `
                    <div class="sub-section">
                        <div><strong>GPU ${index+1}:</strong> ${formatValue(gpu.vendor)} ${formatValue(gpu.model)}</div>
                        <div><strong>Bellek:</strong> ${gpu.vram ? (gpu.vram + ' MB') : 'Bilgi Alınamadı'}</div>
                        <div><strong>Sürücü:</strong> ${formatValue(gpu.driver)}</div>
                    </div>
                `).join('')
                : '<div>Ekran kartı bilgisi bulunamadı</div>'}
            
            <h3>Monitörler</h3>
            ${Array.isArray(safeObject(graphics).displays) && graphics.displays.length > 0 ?
                graphics.displays.map((display, index) => `
                    <div class="sub-section">
                        <div><strong>Monitör ${index+1}:</strong> ${formatValue(display.model)}</div>
                        <div><strong>Çözünürlük:</strong> ${formatValue(display.resolutionX, '0')}x${formatValue(display.resolutionY, '0')}</div>
                        <div><strong>Boyut:</strong> ${display.sizex ? (display.sizex + 'cm x ' + display.sizey + 'cm') : 'Bilgi Alınamadı'}</div>
                    </div>
                `).join('')
                : '<div>Monitör bilgisi bulunamadı</div>'}
        </div>
    `;
    
    // Depolama Bilgileri Tab
    html += `
        <div class="tab-pane" id="storage">
            <h3>Fiziksel Diskler</h3>
            ${Array.isArray(storage) && storage.length > 0 ?
                storage.map((disk, index) => `
                    <div class="sub-section">
                        <div><strong>Disk ${index+1}:</strong> ${formatValue(disk.name)} (${formatValue(disk.vendor)} ${formatValue(disk.model)})</div>
                        <div><strong>Tip:</strong> ${formatValue(disk.type)} / <strong>Arayüz:</strong> ${formatValue(disk.interface)}</div>
                        <div><strong>Boyut:</strong> ${formatBytes(disk.size)}</div>
                        <div><strong>Seri No:</strong> ${formatValue(disk.serial)}</div>
                    </div>
                `).join('')
                : '<div>Disk bilgisi bulunamadı</div>'}
            
            <h3>Dosya Sistemleri</h3>
            ${Array.isArray(filesystem) && filesystem.length > 0 ?
                filesystem.map((fs, index) => `
                    <div class="sub-section">
                        <div><strong>${formatValue(fs.fs)}:</strong> ${formatValue(fs.type)} (${formatValue(fs.mountpoint)})</div>
                        <div><strong>Toplam:</strong> ${formatBytes(fs.size)}</div>
                        <div><strong>Kullanılan:</strong> ${formatBytes(fs.used)} (${
                            fs.size ? Math.round((fs.used / fs.size) * 100) : 0
                        }%)</div>
                        <div><strong>Boş:</strong> ${formatBytes(fs.available)}</div>
                        <div class="storage-bar">
                            <div class="storage-progress" style="width: ${
                                fs.size ? Math.round((fs.used / fs.size) * 100) : 0
                            }%"></div>
                        </div>
                    </div>
                `).join('')
                : '<div>Dosya sistemi bilgisi bulunamadı</div>'}
        </div>
    `;
    
    // Ağ Bilgileri Tab
    html += `
        <div class="tab-pane" id="network">
            <h3>Ağ Arayüzleri</h3>
            ${Array.isArray(network) && network.length > 0 ?
                network.map((iface, index) => `
                    <div class="sub-section">
                        <div><strong>${formatValue(iface.iface)}:</strong> ${formatValue(iface.type)}</div>
                        ${iface.ip4 ? `<div><strong>IPv4:</strong> ${iface.ip4} / <strong>Maske:</strong> ${formatValue(iface.ip4subnet)}</div>` : '<div><strong>IPv4:</strong> Bilgi Alınamadı</div>'}
                        ${iface.ip6 ? `<div><strong>IPv6:</strong> ${iface.ip6}</div>` : '<div><strong>IPv6:</strong> Bilgi Alınamadı</div>'}
                        <div><strong>MAC:</strong> ${formatValue(iface.mac)}</div>
                        <div><strong>Hız:</strong> ${iface.speed ? iface.speed + ' Mbps' : 'Bilgi Alınamadı'}</div>
                        <div><strong>Durum:</strong> ${formatValue(iface.operstate)}</div>
                    </div>
                `).join('')
                : '<div>Ağ arayüzü bilgisi bulunamadı</div>'}
        </div>
    `;
    
    // Detay Bilgiler Tab
    html += `
        <div class="tab-pane" id="details">
            <h3>İşletim Sistemi Detayları</h3>
            <div><strong>Kod adı:</strong> ${formatValue(safeObject(os).codename)}</div>
            <div><strong>Seri No:</strong> ${formatValue(safeObject(os).serial)}</div>
            <div><strong>Build:</strong> ${formatValue(safeObject(os).build)}</div>
            <div><strong>Logo:</strong> ${formatValue(safeObject(os).logofile)}</div>
            
            <h3>CPU Önbellek</h3>
            <div><strong>L1d:</strong> ${safeObject(cpu).cache && cpu.cache.l1d ? formatBytes(cpu.cache.l1d) : 'Bilgi Alınamadı'}</div>
            <div><strong>L1i:</strong> ${safeObject(cpu).cache && cpu.cache.l1i ? formatBytes(cpu.cache.l1i) : 'Bilgi Alınamadı'}</div>
            <div><strong>L2:</strong> ${safeObject(cpu).cache && cpu.cache.l2 ? formatBytes(cpu.cache.l2) : 'Bilgi Alınamadı'}</div>
            <div><strong>L3:</strong> ${safeObject(cpu).cache && cpu.cache.l3 ? formatBytes(cpu.cache.l3) : 'Bilgi Alınamadı'}</div>
            
            <h3>Bellek Detayları</h3>
            <div><strong>Swap Toplam:</strong> ${formatBytes(safeObject(memory).swapTotal || 0)}</div>
            <div><strong>Swap Kullanılan:</strong> ${formatBytes(safeObject(memory).swapUsed || 0)}</div>
            ${memory && memory.swapTotal ? 
                `<div><strong>Swap Kullanım:</strong> ${Math.round((memory.swapUsed / memory.swapTotal) * 100)}%</div>` 
                : '<div><strong>Swap Kullanım:</strong> Bilgi Alınamadı</div>'}
            
            <h3>Sistem Bilgileri</h3>
            <div><strong>UUID:</strong> ${formatValue(safeObject(system).uuid)}</div>
            <div><strong>Seri No:</strong> ${formatValue(safeObject(system).serial)}</div>
        </div>
    `;
    
    html += `</div>`; // Tab içeriğini kapat
    
    systemInfoContent.innerHTML = html;
    
    // Tab değiştirme fonksiyonunu ekle
    const tabButtons = systemInfoContent.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktif tab butonunu değiştir
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // İlgili içeriği göster
            const tabId = button.getAttribute('data-tab');
            const tabPanes = systemInfoContent.querySelectorAll('.tab-pane');
            tabPanes.forEach(pane => pane.classList.remove('active'));
            systemInfoContent.querySelector(`#${tabId}`).classList.add('active');
        });
    });
});

// Command execution handler
executeCommandBtn.addEventListener('click', () => {
    const command = commandInput.value.trim();
    if (!command) return;

    commandOutput.textContent = 'Executing command...';
    socket.emit('execute-command', command);
});

socket.on('command-result', (data) => {
    if (data.error) {
        commandOutput.textContent = `Error: ${data.error}\n\n${data.output || ''}`;
        return;
    }

    commandOutput.textContent = data.output || 'Command executed (no output)';
});

// Directory listing handler
listDirectoryBtn.addEventListener('click', () => {
    const directory = directoryInput.value.trim();
    directoryOutput.textContent = 'Loading directory contents...';
    socket.emit('list-directory', directory);
});

socket.on('directory-list', (data) => {
    if (data.error) {
        directoryOutput.textContent = `Error: ${data.error}\n\n${data.content || ''}`;
        return;
    }

    directoryOutput.textContent = data.content || 'No files found';
});

// Screenshot handler
takeScreenshotBtn.addEventListener('click', () => {
    screenshotResult.innerHTML = '<div>Taking screenshot...</div>';
    socket.emit('take-screenshot');
});

socket.on('screenshot-result', (data) => {
    if (data.error) {
        screenshotResult.innerHTML = `<div class="error">Error: ${data.error}</div>`;
        return;
    }

    // In a real implementation, this would display the actual screenshot
    // For this demo, we just show the message and display info
    screenshotResult.innerHTML = `
        <div>${data.message}</div>
        <div>Display information: ${JSON.stringify(data.displays)}</div>
    `;
});

// System monitoring handler
startMonitoringBtn.addEventListener('click', () => {
    if (statsContainer.classList.contains('hidden')) {
        statsContainer.classList.remove('hidden');
        startMonitoringBtn.textContent = 'Stop Monitoring';
        socket.emit('monitor-system');
    } else {
        statsContainer.classList.add('hidden');
        startMonitoringBtn.textContent = 'Start Monitoring';
        // We could add a socket event to stop monitoring on the server if needed
    }
});

socket.on('system-stats', (data) => {
    // Update CPU usage
    const cpuPercent = Math.round(data.cpu);
    cpuBar.style.width = `${cpuPercent}%`;
    cpuUsage.textContent = `${cpuPercent}%`;

    // Update memory usage - Fixing NaN issue
    if (data.memory && typeof data.memory.used === 'number' && typeof data.memory.total === 'number' && data.memory.total > 0) {
        const memPercent = Math.round((data.memory.used / data.memory.total) * 100);
        memoryBar.style.width = `${memPercent}%`;
        memoryUsage.textContent = `${memPercent}% (${formatBytes(data.memory.used)} / ${formatBytes(data.memory.total)})`;
    } else {
        memoryBar.style.width = '0%';
        memoryUsage.textContent = 'Memory data unavailable';
    }

    // Update uptime
    uptime.textContent = formatUptime(data.uptime);
});

// Yeni eklenen özellikler için eventler

// Process listesi
listProcessesBtn.addEventListener('click', () => {
    processOutput.textContent = 'Loading process list...';
    socket.emit('list-processes');
});

socket.on('process-list', (data) => {
    if (data.error) {
        processOutput.textContent = `Error: ${data.error}`;
        return;
    }
    processOutput.textContent = data.content || 'No processes found';
});

// Process sonlandırma
killProcessBtn.addEventListener('click', () => {
    const pid = processIdInput.value.trim();
    if (!pid) {
        alert('Please enter a process ID');
        return;
    }
    
    if (!confirm(`Are you sure you want to terminate process ${pid}?`)) {
        return;
    }
    
    processOutput.textContent = `Attempting to terminate process ${pid}...`;
    socket.emit('kill-process', pid);
});

socket.on('process-kill-result', (data) => {
    if (data.error) {
        processOutput.textContent = `Error: ${data.error}\n\n${data.output || ''}`;
        return;
    }
    
    processOutput.textContent = data.success 
        ? `Process terminated successfully\n${data.output || ''}` 
        : `Failed to terminate process\n${data.output || ''}`;
        
    // Refresh process list after kill attempt
    setTimeout(() => {
        socket.emit('list-processes');
    }, 1000);
});

// Ağ taraması
scanNetworkBtn.addEventListener('click', () => {
    networkOutput.textContent = 'Scanning network...';
    socket.emit('scan-network');
});

socket.on('network-scan-result', (data) => {
    if (data.error) {
        networkOutput.textContent = `Error: ${data.error}`;
        return;
    }
    networkOutput.textContent = data.content || 'No network devices found';
});

// Registry okuma
readRegistryBtn.addEventListener('click', () => {
    const path = registryPathInput.value.trim();
    if (!path) {
        alert('Please enter a registry path');
        return;
    }
    
    registryOutput.textContent = `Reading registry at ${path}...`;
    socket.emit('read-registry', path);
});

socket.on('registry-read-result', (data) => {
    if (data.error) {
        registryOutput.textContent = `Error: ${data.error}`;
        return;
    }
    registryOutput.textContent = data.content || 'No registry data found';
});

// Utility functions
function formatBytes(bytes) {
    if (bytes === 0 || !bytes) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatUptime(seconds) {
    if (!seconds && seconds !== 0) return 'Unknown';
    
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    result += `${secs}s`;
    
    return result;
}

// Event listeners for input fields to enable Enter key submission
commandInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        executeCommandBtn.click();
    }
});

directoryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        listDirectoryBtn.click();
    }
});

processIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        killProcessBtn.click();
    }
});

registryPathInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        readRegistryBtn.click();
    }
});

// Add mobile touch event handlers
document.addEventListener('DOMContentLoaded', () => {
    // Add Android touch feedback
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', () => {
            button.classList.add('touch-active');
        });
        
        button.addEventListener('touchend', () => {
            button.classList.remove('touch-active');
            setTimeout(() => button.classList.remove('touch-active'), 300);
        });
    });
    
    // Fix double tap zoom issues
    const interactiveElements = document.querySelectorAll('button, input');
    interactiveElements.forEach(element => {
        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            // Normal click behavior will still occur
        });
    });
    
    // Improve scrolling on Android
    const outputContainers = document.querySelectorAll('.output-container');
    outputContainers.forEach(container => {
        container.addEventListener('touchstart', (e) => {
            // Allow normal scrolling within output containers
            e.stopPropagation();
        });
    });
});

// Detect if running on Android
const isAndroid = /Android/i.test(navigator.userAgent);
if (isAndroid) {
    document.body.classList.add('android-device');
    console.log('Android device detected. Enabling mobile optimizations.');
} 