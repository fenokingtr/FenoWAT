# FenoWAT - Web Tabanlı Yönetim Aracı

Node.js, Express ve Socket.io ile oluşturulmuş kapsamlı bir web tabanlı yönetim aracı. Bu uygulama, ağ üzerinden bir bilgisayarı uzaktan yönetmenizi sağlar.

## İçindekiler

1. [Proje Hakkında](#proje-hakkında)
2. [Özellikler](#özellikler)
3. [Proje Yapısı](#proje-yapısı)
4. [Dosya Açıklamaları](#dosya-açıklamaları)
5. [Kurulum](#kurulum)
6. [Kullanım](#kullanım)
7. [Yapılandırma](#yapılandırma)
8. [Özelleştirme](#özelleştirme)
9. [Geliştirme](#geliştirme)
10. [Gelecek Planları](#gelecek-planları)
11. [Sorumluluk Reddi](#sorumluluk-reddi)
12. [Lisans](#lisans)

## Proje Hakkında

FenoWAT (Web Administration Tool), bir web tarayıcısı üzerinden hedef bilgisayarı izlemenizi ve yönetmenizi sağlayan güçlü bir araçtır. Node.js backend ve modern bir web arayüzü kullanarak, sistem bilgilerini görüntüleme, komut çalıştırma ve dosya sistemi ile etkileşim kurma gibi temel işlevlerin yanı sıra süreç yönetimi, ağ izleme ve Windows Registry düzenleme gibi gelişmiş özellikler sunar.

## Özellikler

- **Uzaktan Komut Çalıştırma**: Terminal komutlarını uzaktan çalıştırma ve sonuçları görme
- **Dosya Sistemi Gezintisi**: Dosya sistemini uzaktan görüntüleme ve gezinme
- **Sistem İzleme**: 
  - CPU kullanımını gerçek zamanlı izleme
  - Bellek kullanımını gerçek zamanlı izleme (NaN hatası düzeltildi)
  - Sistem çalışma süresini takip etme
- **Sistem Bilgileri**: 
  - İşletim sistemi detayları
  - CPU özellikleri
  - Bellek durumu
  - Ağ arayüzleri
- **Ekran Görüntüsü**: Hedef sistemden ekran görüntüsü alma özelliği (şu anda simüle edilmiş)
- **Süreç Yöneticisi** (YENİ):
  - Çalışan tüm süreçleri listeleme
  - İstenmeyen süreçleri sonlandırma
- **Ağ İzleme** (YENİ):
  - Yerel ağdaki cihazları tarama
  - ARP tablosunu görüntüleme
- **Registry Düzenleyici** (YENİ):
  - Windows Registry anahtarlarını okuma
  - Registry değerlerini görüntüleme

## Proje Yapısı

```
FenoWAT/
│
├── server.js                # Ana sunucu dosyası
├── package.json             # NPM paket yapılandırması
├── README.md                # Bu dokümantasyon dosyası
│
└── public/                  # Client-side dosyaları
    ├── index.html           # Web arayüzü HTML yapısı
    ├── styles.css           # Web arayüzü stilleri
    └── script.js            # Client-side JavaScript kodu
```

## Dosya Açıklamaları

### server.js

Bu, uygulamanın kalbidir. Aşağıdaki temel bileşenleri içerir:

- **Express Sunucusu**: Web sunucusu ve API endpoints
- **Socket.io Bağlantısı**: Real-time iletişim için
- **Sistem Bilgileri Toplama**: systeminformation ve node-os-utils paketleri kullanılarak
- **Komut Çalıştırma**: child_process modülü ile terminal komutlarını çalıştırma
- **Dosya Sistemi İşlemleri**: Dizin içeriklerini listeleme
- **Süreç Yönetimi**: Süreçleri listeleme ve sonlandırma
- **Ağ İzleme**: ARP tablosunu kullanarak ağ cihazlarını tarama
- **Registry İşlemleri**: Windows Registry değerlerini okuma

Önemli kısımlar:
- **25-84. Satırlar**: Socket.io bağlantı yönetimi ve temel event handler'lar
- **86-124. Satırlar**: Yeni eklenen özellikler için event handler'lar
- **128-166. Satırlar**: Sistem bilgilerini toplama fonksiyonu
- **169-174. Satırlar**: Sunucu başlatma konfigürasyonu

### public/index.html

Web arayüzünün yapısını tanımlar. Önemli bölümler:

- **10-14. Satırlar**: Başlık (artık "FenoWAT") ve bağlantı durumu
- **18-27. Satırlar**: Web Administration Tool paneli (eski Sistem bilgileri paneli)
- **29-46. Satırlar**: Sistem izleme paneli
- **48-57. Satırlar**: Komut çalıştırma paneli
- **59-68. Satırlar**: Dosya gezgini paneli
- **70-76. Satırlar**: Ekran görüntüsü paneli
- **79-115. Satırlar**: Yeni eklenen panel'ler (Süreç Yöneticisi, Ağ İzleme, Registry Düzenleyici)

### public/script.js

Client-side mantığını yönetir. Önemli fonksiyonlar:

- **22-30. Satırlar**: Bağlantı olayları yönetimi
- **33-58. Satırlar**: Sistem bilgilerini işleme ve görüntüleme
- **61-75. Satırlar**: Komut çalıştırma fonksiyonları
- **78-90. Satırlar**: Dizin listeleme fonksiyonları
- **93-111. Satırlar**: Ekran görüntüsü alma fonksiyonları
- **114-143. Satırlar**: Sistem izleme fonksiyonları (Memory NaN hatası düzeltildi)
- **146-209. Satırlar**: Yeni özellikler için fonksiyonlar
- **212-237. Satırlar**: Yardımcı fonksiyonlar (bayt formatı, süre formatı)

### package.json

NPM paket yapılandırmasını içerir. Önemli kısımlar:

- **6-10. Satırlar**: Çalıştırma scriptleri (start, dev)
- **16-21. Satırlar**: Proje bağımlılıkları

## Kurulum

### Gereksinimler

- Node.js (v12.0 veya üzeri)
- npm (Node Paket Yöneticisi)

### Adımlar

1. Bu depoyu klonlayın:
   ```bash
   git clone https://github.com/kullanici-adi/FenoWAT.git
   cd FenoWAT
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Sunucuyu başlatın:
   ```bash
   npm start
   ```
   
4. Kontrol paneline web tarayıcısından erişin:
   ```
   http://localhost:3000
   ```

### Geliştirme Modu

Geliştirme yaparken, dosyalardaki değişikliklerde otomatik yeniden başlatma için:

```bash
npm run dev
```

## Kullanım

### Sistem Bilgileri Görüntüleme

"Web Administration Tool" paneli (eski adıyla "Sistem Bilgisi"), hedef sistemin aşağıdaki bilgilerini gösterir:
- İşletim sistemi türü ve sürümü
- Bilgisayar adı
- CPU markası, modeli ve özellikleri
- Bellek kapasitesi ve kullanımı
- Ağ arayüzleri ve IP adresleri

### Sistem İzleme

1. "Sistem İzleme" panelinde "İzlemeyi Başlat" düğmesine tıklayın
2. CPU ve bellek kullanımını gerçek zamanlı olarak izleyin
3. Grafiklerdeki değişimleri takip edin
4. İzlemeyi durdurmak için tekrar düğmeye tıklayın

Not: Bellek kullanımı izlemesinde görülen NaN (Not a Number) hatası düzeltilmiştir. Sistem bellek verilerinin geçersiz olduğu durumlarda uygun bir hata mesajı gösterilecektir.

### Komut Çalıştırma

1. "Komut Çalıştırma" panelinde komut giriş alanına bir terminal komutu yazın
2. "Çalıştır" düğmesine tıklayın veya Enter tuşuna basın
3. Komut çıktısı alt kısımda görüntülenecektir

Örnek komutlar:
- `ipconfig` veya `ifconfig` - Ağ yapılandırmasını görüntüler
- `systeminfo` - Detaylı sistem bilgilerini gösterir (Windows)
- `dir` veya `ls` - Dizin içeriğini listeler

### Dosya Gezgini

1. "Dosya Gezgini" panelinde bir dizin yolu girin (örn. `C:\` veya `/home/user`)
2. "Listele" düğmesine tıklayın
3. Dizin içeriği aşağıda listelenecektir

### Ekran Görüntüsü Alma

1. "Ekran Görüntüsü" panelinde "Ekran Görüntüsü Al" düğmesine tıklayın
2. Alınan ekran görüntüsü (veya şu anki simülasyon bilgisi) görüntülenecektir

### Süreç Yöneticisi (YENİ)

1. "Süreç Yöneticisi" panelinde "Süreçleri Listele" düğmesine tıklayın
2. Sistemde çalışan tüm süreçler ve ilgili bilgiler listelenecektir
3. Sonlandırmak istediğiniz sürecin PID'sini (Process ID) giriş alanına yazın
4. "Sonlandır" düğmesine tıklayın
5. Onay mesajını kabul edin

### Ağ İzleme (YENİ)

1. "Ağ İzleme" panelinde "Ağı Tara" düğmesine tıklayın
2. ARP tablosu kullanılarak ağdaki cihazlar listelenecektir

### Registry Düzenleyici (YENİ)

1. "Registry Düzenleyici" panelinde bir registry yolu girin (örn. `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion`)
2. "Oku" düğmesine tıklayın
3. İlgili registry anahtarları ve değerleri görüntülenecektir

Not: Bu özellik yalnızca Windows sistemlerde çalışır.

## Yapılandırma

### Port Değiştirme

Varsayılan port 3000'dir. Değiştirmek için:

1. `server.js` dosyasının en altındaki satırı düzenleyin:
   ```javascript
   const PORT = process.env.PORT || 3000;
   ```
   Örneğin, port 8080 için:
   ```javascript
   const PORT = process.env.PORT || 8080;
   ```

2. Veya doğrudan çevre değişkeni ile belirleyin:
   ```bash
   PORT=8080 npm start
   ```

### Komut Yürütme Güvenliği

Güvenlik nedeniyle belirli komutları kısıtlamak için, `server.js` dosyasında komut çalıştırma kısmını düzenleyebilirsiniz. Şu kısmı bulun:

```javascript
socket.on('execute-command', (command) => {
  console.log(`Executing command: ${command}`);
  
  exec(command, (error, stdout, stderr) => {
    socket.emit('command-result', {
      output: stdout || stderr,
      error: error ? error.message : null
    });
  });
});
```

Ve güvenlik kontrolü ekleyin, örneğin:

```javascript
socket.on('execute-command', (command) => {
  // Tehlikeli komutları engelle
  const blacklist = ['rm -rf', 'format', 'deltree'];
  if (blacklist.some(cmd => command.includes(cmd))) {
    socket.emit('command-result', {
      output: 'Bu komut güvenlik nedeniyle engellendi.',
      error: 'İzin verilmeyen komut'
    });
    return;
  }
  
  console.log(`Executing command: ${command}`);
  // ... devam eden kod
});
```

## Özelleştirme

### Arayüz Renkleri

Ana renkleri değiştirmek için `public/styles.css` dosyasında şu kısımları düzenleyin:

- Arka plan rengi (7-8. satırlar):
  ```css
  body {
      background-color: #f4f7f9;
  }
  ```

- Buton rengi (62-65. satırlar):
  ```css
  .input-group button, button {
      background-color: #3498db;
  }
  
  .input-group button:hover, button:hover {
      background-color: #2980b9;
  }
  ```

- İlerleme çubuğu renkleri (105-108. satırlar):
  ```css
  .progress {
      background-color: #2ecc71;
  }
  
  #memory-bar {
      background-color: #3498db;
  }
  ```

### Başlık Değiştirme

Uygulama başlıklarını değiştirmek için:

1. Ana başlık (h1) - `public/index.html` dosyasında 12. satırdaki `<h1>FenoWAT</h1>` etiketini değiştirin
2. Alt başlık (h2) - Sistem bilgileri panelindeki başlık artık "Web Administration Tool" olarak değiştirilmiştir

### Yeni Panel Ekleme

Yeni bir özellik paneli eklemek için:

1. `public/index.html` dosyasında `.dashboard` içine yeni bir bölüm ekleyin:
   ```html
   <section class="yeni-ozellik panel">
       <h2>Yeni Özellik</h2>
       <div class="input-group">
           <input type="text" id="yeni-input" placeholder="Bilgi girin...">
           <button id="yeni-button">Çalıştır</button>
       </div>
       <div class="output-container">
           <pre id="yeni-output">Sonuçlar burada görünecek...</pre>
       </div>
   </section>
   ```

2. `public/script.js` dosyasında DOM elemanlarını tanımlayın:
   ```javascript
   const yeniInput = document.getElementById('yeni-input');
   const yeniButton = document.getElementById('yeni-button');
   const yeniOutput = document.getElementById('yeni-output');
   ```

3. Olay dinleyicisi ve socket işlemlerini ekleyin:
   ```javascript
   yeniButton.addEventListener('click', () => {
       const veri = yeniInput.value.trim();
       if (!veri) return;
       
       yeniOutput.textContent = 'İşlem yapılıyor...';
       socket.emit('yeni-islem', veri);
   });
   
   socket.on('yeni-islem-sonuc', (data) => {
       yeniOutput.textContent = data.sonuc || 'Sonuç bulunamadı';
   });
   ```

4. `server.js` dosyasında sunucu tarafı işleyiciyi ekleyin:
   ```javascript
   socket.on('yeni-islem', (veri) => {
       // Veriyi işle
       const sonuc = `İşlenen veri: ${veri}`;
       socket.emit('yeni-islem-sonuc', { sonuc });
   });
   ```

## Geliştirme

### Yeni Özellik Ekleme Kılavuzu

1. Önce server.js dosyasında socket.io handler ekleyin
2. Sonra client-side script.js dosyasında ilgili fonksiyonları yazın
3. Son olarak HTML arayüzünde gerekli UI elemanlarını oluşturun

### Hata Ayıklama

Sunucu tarafı logları görmek için:
```bash
npm start
```

Client tarafı hata ayıklama için, tarayıcının Geliştirici Araçları'nı açın (F12) ve Console sekmesini kontrol edin.

### Memory Usage Hatası Düzeltmesi

Önceki sürümde bellek kullanım verilerinin NaN (Not a Number) olarak görüntülenmesi sorunu aşağıdaki şekilde düzeltilmiştir:

1. `script.js` dosyasındaki bellek verilerini işleyen kısım güçlendirildi:
   ```javascript
   if (data.memory && typeof data.memory.used === 'number' && typeof data.memory.total === 'number' && data.memory.total > 0) {
       const memPercent = Math.round((data.memory.used / data.memory.total) * 100);
       memoryBar.style.width = `${memPercent}%`;
       memoryUsage.textContent = `${memPercent}% (${formatBytes(data.memory.used)} / ${formatBytes(data.memory.total)})`;
   } else {
       memoryBar.style.width = '0%';
       memoryUsage.textContent = 'Memory data unavailable';
   }
   ```

2. formatBytes() fonksiyonu null veya undefined değerleri kontrol edecek şekilde güncellendi:
   ```javascript
   function formatBytes(bytes) {
       if (bytes === 0 || !bytes) return '0 Bytes';
       // ...devamı
   }
   ```

3. formatUptime() fonksiyonu geçersiz uptime değerlerini kontrol edecek şekilde güncellendi

## Gelecek Planları

Aşağıdaki özellikler gelecek sürümlerde eklenecektir:

### Kısa Vadeli Güncellemeler (v1.1)

1. **Android Uyumluluğu (TAMAMLANDI)**: 
   - Mobil cihazlardan erişim için duyarlı tasarım
   - Dokunmatik ekran optimizasyonları
   - QR kod ile kolay bağlantı
   - Tahmini tamamlanma: Tamamlandı ✓

2. **Gerçek Ekran Görüntüsü**: Şu anki simülasyon yerine gerçek ekran görüntüsü alma
   - Uygulanacak dosya: `server.js` (50-60. satırlar arasını değiştir)
   - Gerekli paket: `screenshot-desktop`
   - Tahmini tamamlanma: 2 hafta

3. **Gelişmiş Sistem Bilgisi Görüntüleme**: 
   - Daha detaylı donanım bilgileri
   - Grafiksel disk kullanım bilgisi
   - Çalışan servislerin listesi
   - Tahmini tamamlanma: 2 hafta

4. **Performans İyileştirmeleri**:
   - Daha hızlı veri aktarımı için Socket.io optimizasyonları
   - Önbelleğe alma mekanizmaları
   - Tahmini tamamlanma: 1 hafta

### Orta Vadeli Güncellemeler (v1.2)

5. **Dosya Transferi**: Uzak sistem ile dosya yükleme/indirme özellikleri
   - Yeni socket event'ları: 'file-upload', 'file-download'
   - Sürükle-bırak dosya yükleme arayüzü
   - Dosya indirme ilerlemesi
   - Tahmini tamamlanma: 4 hafta

6. **Kimlik Doğrulama Sistemi**: Güvenli erişim için kullanıcı/şifre sistemi
   - JWT veya session tabanlı kimlik doğrulama
   - Login sayfası
   - Tahmini tamamlanma: 3 hafta

7. **Ağ İzleme Araçları**:
   - Port tarama
   - Ağ trafiği izleme
   - Internet hız testi
   - Tahmini tamamlanma: 3 hafta

8. **Geliştirilmiş Registry Düzenleyici**: Windows Registry değerlerini düzenleme özelliği
   - Registry anahtarlarını oluşturma, düzenleme ve silme
   - Daha kullanıcı dostu arayüz
   - Registry yedekleme ve geri yükleme
   - Tahmini tamamlanma: 2 hafta

### Uzun Vadeli Güncellemeler (v2.0)

9. **Uzaktan Klavye/Fare Kontrolü**: Sistemi uzaktan kontrol etme
   - Gerekli paketler: `robotjs` veya `iohook`
   - Yeni bir kontrol paneli arayüzü
   - Ekran paylaşımı
   - Tahmini tamamlanma: 8 hafta

10. **Çoklu Sistem Yönetimi**: Birden fazla bilgisayarı tek panelden yönetme
    - İstemci/sunucu mimarisi değişikliği
    - Ana sunucu ve çoklu istemci yapısı
    - Gruplu işlemler (birden fazla sisteme komut gönderme)
    - Merkezi gösterge paneli
    - Tahmini tamamlanma: 12 hafta

11. **Zamanlanmış Görevler**: Belirli zamanlarda otomatik olarak komut çalıştırma
    - Cron tarzı zamanlama sistemi
    - Görev planlama ve yönetim arayüzü
    - Görev çalıştırma geçmişi
    - Tahmini tamamlanma: 4 hafta

12. **Sistem Günlükleri İzleyici**: Windows Event Log ve Linux syslog gibi sistem günlüklerini izleme
    - Gerçek zamanlı log takibi
    - Log filtreleme ve analiz özellikleri
    - Log uyarı sistemi
    - Tahmini tamamlanma: 6 hafta

13. **Mobil Uygulama**: Mobil cihazlardan erişim için uygulama
    - Android ve iOS sürümleri
    - Bildirim sistemi
    - Düşük bant genişliği modu
    - Tahmini tamamlanma: 16 hafta

### Özellik İstekleri ve Katkıda Bulunma

Yeni özellik önerileri ve katkılarınız için GitHub repository üzerinden issue açabilir veya pull request gönderebilirsiniz. Projeye katkıda bulunmak isteyenler için detaylı bilgi CONTRIBUTING.md dosyasında bulunmaktadır.

Gelecek sürümler hakkında en güncel bilgileri proje deposunun "Projects" sekmesinden takip edebilirsiniz.

## Android Uyumluluğu

FenoWAT artık Android mobil cihazlarda kullanılabilir! Bu özellik sayesinde telefonunuz veya tabletinizden sisteminizi uzaktan yönetebilirsiniz.

### Android'de Kullanım

1. **Bağlantı Kurma**:
   - Bilgisayarınız ve Android cihazınız aynı Wi-Fi ağında olmalıdır
   - Sunucu başladığında görüntülenen IP adresini Android cihazınızın web tarayıcısına girin (örnek: `http://192.168.158.65:3000`)
   - Alternatif olarak, konsoldaki QR kodu tarayarak doğrudan bağlanabilirsiniz
   - Sunucu başlatıldığında konsol ekranında IP adresinin yanında QR kod görüntülenir

2. **Arayüz Optimizasyonları**:
   - Mobil ekran boyutları için optimize edilmiş düzen
   - Dokunmatik ekran için büyütülmüş butonlar ve form elemanları
   - Parmakla kaydırma için iyileştirilmiş alanlar
   - Çift dokunma yakınlaştırma sorunları giderildi
   - Dokunmatik geri bildirim efektleri eklendi

3. **Güvenlik Önlemleri**:
   - Mobil cihazlardan erişimde potansiyel olarak tehlikeli komutlar engellenir
   - Sistem dosyalarını etkileyebilecek işlemler için ek kontroller (rm, format, deltree vb. komutlar)
   - Windows sistem klasörlerine erişim kısıtlamaları
   - Daha güvenli bir uzaktan yönetim deneyimi

### Teknik Değişiklikler

- **Sunucu Yapılandırması**:
  - `server.js` tüm ağ arayüzlerinde dinleme yapacak şekilde güncellendi (0.0.0.0)
  - QR kod oluşturma için `qrcode` npm paketi eklendi
  - Komut çalıştırma güvenliği artırıldı
  - Harici IP adresleri ve ağ arayüzleri otomatik tespit edildi

- **Mobil Arayüz Geliştirmeleri**:
  - Meta viewport etiketleri mobil deneyim için optimize edildi
  - Progressive Web App (PWA) özelliği için meta etiketleri eklendi (`mobile-web-app-capable`, `apple-mobile-web-app-capable`)
  - CSS medya sorguları ile duyarlı tasarım iyileştirildi (480px altı ekranlar için özel stiller)
  - Dokunmatik olayları için özel JavaScript yöneticileri eklendi (touchstart, touchend)

- **Kullanıcı Deneyimi**:
  - Mobil cihazlarda form elemanları yeniden boyutlandırıldı
  - Çıktı alanları mobil görünüm için optimize edildi (daha küçük font, yükseklik ayarlamaları)
  - Butonlar dokunmaya daha duyarlı hale getirildi (daha büyük tıklama alanları)
  - Android cihaz algılama ve otomatik stil uygulama eklendi (User-Agent kontrolü)
  - Dokunmatik stil efektleri için `.touch-active` sınıfı eklendi

### Tam Ekran Modu

Android cihazlarda FenoWAT'ı tam ekran modunda kullanmak için:

1. Chrome tarayıcısını açın ve FenoWAT'ı yükleyin (QR kod veya IP adresi ile)
2. Tarayıcının üç nokta menüsüne tıklayın (⋮)
3. "Ana Ekrana Ekle" seçeneğini seçin
4. İsim ve simgeyi onaylayın
5. Artık Android ana ekranınızdan FenoWAT'a tam ekran olarak erişebilirsiniz

### Bilinen Sınırlamalar

- Bazı sistem yönetimi işlemleri (özellikle Windows'a özgü) mobil cihazlarda sınırlı olabilir
- Karmaşık terminal komutları için tam boyutlu klavye tercih edilir
- En iyi deneyim için Chrome tarayıcısı önerilir (sürüm 88+)
- Güvenlik nedeniyle bazı kritik sistem komutları engellenir
- Düşük bant genişliğinde bazı veriler daha yavaş yüklenebilir

### Gelecek Mobil Geliştirmeler

- Offline çalışma modu
- Daha doğal bir mobil uygulama hissi için Service Worker entegrasyonu
- Bildirim API entegrasyonu
- Dokunmatik sürükle-bırak dosya yönetimi
- Özelleştirilebilir mobil tema seçenekleri

### Ekran Görüntüleri

_Mobil ekran görüntüleri yakında eklenecek_

## Sürüm Geçmişi

### v1.1.0 (Güncel Sürüm)
- Android uyumluluğu eklendi
- Dokunmatik ekran optimizasyonları
- QR kod ile kolay bağlantı
- Duyarlı mobil tasarım

### v1.0.0
- İlk kararlı sürüm
- Temel sistem bilgileri görüntüleme
- Komut çalıştırma
- Dosya sistemi gezintisi
- Süreç yönetimi
- Ağ taraması
- Windows Registry okuma

### v0.9.0 (Beta)
- Arayüz iyileştirmeleri
- Sistem bilgisi sekmeli yapı
- Tema desteği
- Hata düzeltmeleri

### v0.5.0 (Alpha)
- İlk deneme sürümü
- Temel özellikler

## Sorumluluk Reddi

Bu uygulama yalnızca eğitim amaçlıdır. Sahip olmadığınız veya erişim izniniz olmayan sistemlere karşı uzaktan yönetim araçlarının izinsiz kullanımı yasadışı ve etik dışıdır. Bu uygulamayı yalnızca kendi sistemlerinizde veya açık izin aldığınız sistemlerde kullanın.

Geliştiriciler, bu yazılımın kötüye kullanımından sorumlu tutulamaz.

## Lisans

Daha fazla bilgi için LICENSE dosyasına bakın. 