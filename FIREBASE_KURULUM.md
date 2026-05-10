# 🔥 FIREBASE KURULUM REHBERİ

Bu rehber, web siteniz için Firebase Firestore (ücretsiz veritabanı) kurulumunu adım adım anlatmaktadır.

## ⏱️ Tahmini Süre: 5-7 dakika

---

## ADIM 1: Firebase Hesabı Oluşturma

1. **Firebase Console'a gidin:** https://console.firebase.google.com/
2. **Google hesabınızla giriş yapın** (Gmail hesabı gerekli)
3. **"Proje ekle" (Add project)** butonuna tıklayın

---

## ADIM 2: Firebase Projesi Oluşturma

1. **Proje adı:** `lex-partners-hukuk` (veya istediğiniz bir isim)
2. **Google Analytics:** İSTEMİYORSANIZ kapatabilirsiniz
3. **"Proje oluştur"** butonuna tıklayın
4. Proje hazır olana kadar **30-60 saniye bekleyin**

---

## ADIM 3: Web Uygulaması Ekleme

1. Proje oluşturulduktan sonra **"</>" (Web) ikonuna** tıklayın
2. **Uygulama takma adı:** `Hukuk Web Sitesi`
3. **Firebase Hosting:** TIKLAMAYIN (gerek yok)
4. **"Uygulamayı kaydet"** butonuna tıklayın

---

## ADIM 4: Firebase Config Bilgilerini Kopyalama

Şimdi ekranda **firebaseConfig** bilgileri görünecek:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "lex-partners-hukuk.firebaseapp.com",
  projectId: "lex-partners-hukuk",
  storageBucket: "lex-partners-hukuk.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:XXXXXXXXXXXXXXXX"
};
```

**BU BİLGİLERİ KOPYALAYIN!** (Not defterine yapıştırın)

---

## ADIM 5: Firestore Database Oluşturma

1. Sol menüden **"Build" > "Firestore Database"** seçin
2. **"Create database"** butonuna tıklayın
3. **Konum seçin:** `europe-west` (Avrupa - en yakın)
4. **Güvenlik kuralları:** **"Test modunda başlat" (Start in test mode)** seçin
   - ⚠️ **ÖNEMLİ:** Bu geliştirme için, sonra güvenlik kurallarını düzenleyeceğiz
5. **"Etkinleştir" (Enable)** butonuna tıklayın

---

## ADIM 6: Güvenlik Kurallarını Ayarlama

1. Firestore Database sayfasında **"Rules" (Kurallar)** sekmesine gidin
2. Aşağıdaki kuralları yapıştırın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Blog yazılarını herkes okuyabilir
    match /blogs/{blogId} {
      allow read: if true;
      // Sadece admin panelinden yazma (şifre kontrolü client-side)
      allow write: if true;
    }
  }
}
```

3. **"Yayınla" (Publish)** butonuna tıklayın

---

## ADIM 7: Web Sitenize Firebase Config Ekleme

1. **`script.js`** dosyanızı açın
2. **3-10. satırlar arasındaki** `firebaseConfig` değişkenini bulun:

```javascript
const firebaseConfig = {
    apiKey: "BURAYA_API_KEY_GELECEK",
    authDomain: "BURAYA_AUTH_DOMAIN_GELECEK",
    // ...
};
```

3. **ADIM 4'te kopyaladığınız bilgilerle DEĞİŞTİRİN:**

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "lex-partners-hukuk.firebaseapp.com",
    projectId: "lex-partners-hukuk",
    storageBucket: "lex-partners-hukuk.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:XXXXXXXXXXXXXXXX"
};
```

4. **Dosyayı kaydedin**

---

## ADIM 8: İlk Blog Yazısını Ekleme (Test)

1. Web sitenizi tarayıcıda açın (`index.html`)
2. **"Admin Paneli"** butonuna tıklayın
3. **Şifre:** `admin123`
4. **"Yeni Yazı Ekle"** sekmesinde bir test yazısı ekleyin:
   - Başlık: Test Yazısı
   - İçerik: Bu bir test yazısıdır.
   - Yazar: Test Kullanıcı
5. **"Yazıyı Yayınla"** butonuna tıklayın
6. Sayfa yenileyin - blog yazısı görünecek! ✅

---

## ✅ KURULUM TAMAMLANDI!

Artık:
- ✅ Admin panelden blog yazısı ekleyebilirsiniz
- ✅ Eklenen yazılar **HERKESTE** görünür
- ✅ Sayfa yenilendiğinde yazılar **kaybolmaz**
- ✅ Tamamen **ÜCRETSİZ** (aylık 50.000 okuma, 20.000 yazma)
- ✅ Backend sunucusu **GEREKSIZ**

---

## 🎯 ÖNEMLİ NOTLAR

### Admin Şifresini Değiştirme (Önerilen)

1. `script.js` dosyasını açın
2. **35. satırı** bulun:
```javascript
if (password === 'admin123') {
```
3. `admin123` yerine **kendi şifrenizi** yazın:
```javascript
if (password === 'GüçlüŞifre2026!') {
```

### Güvenlik (Production için)

Proje canlıya çıktıktan sonra, Firestore güvenlik kurallarını güçlendirin:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /blogs/{blogId} {
      allow read: if true;
      // Sadece belirli bir kullanıcı yazabilir (Firebase Auth ile)
      allow write: if request.auth != null && request.auth.uid == "YOUR_ADMIN_UID";
    }
  }
}
```

### Ücretsiz Limitler

Firebase Spark (Ücretsiz) Plan:
- ✅ **50.000 okuma/gün**
- ✅ **20.000 yazma/gün**
- ✅ **1 GB depolama**
- ✅ **10 GB transfer**

Bir hukuk sitesi için **fazlasıyla yeterli!**

---

## 🆘 Sorun mu yaşıyorsunuz?

### "Firebase is not defined" hatası
- Firebase SDK script'lerinin `<head>` içinde olduğundan emin olun
- İnternet bağlantınızı kontrol edin

### Blog yazıları görünmüyor
- Tarayıcı konsolunu açın (F12)
- Hata mesajlarını kontrol edin
- Firebase Config bilgilerinin doğru olduğundan emin olun

### Admin paneli açılmıyor
- `script.js` dosyasının `index.html` ile aynı klasörde olduğundan emin olun
- Tarayıcı önbelleğini temizleyin (Ctrl+Shift+Delete)

---

## 📞 İletişim

Sorun yaşarsanız Firebase Console'daki:
- **Support** > **Documentation** bölümünü ziyaret edin
- Firebase YouTube kanalını izleyin

**Başarılar! 🎉**
