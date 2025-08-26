# 📦 Mobiva RN Test Case

Bu proje, React Native + TypeScript kullanılarak geliştirilmiş bir
**Kargo Simülasyon Uygulaması**dır.\
Amaç: Kirli veri seti üretmek, temizlemek, listelemek, filtrelemek ve
detaylarını göstermek.

------------------------------------------------------------------------

## 🏗 Mimari

-   **React Native + TypeScript**
-   **State Management** → Zustand
-   **Navigation** → React Navigation (Bottom Tabs + Stack)
-   **UUID** → id üretimi için
-   **Random Name Generator** → 8-16 karakter alfanumerik string

### 📂 Klasör Yapısı

    App.tsx           # Navigation setup
    src/
     ├─ store/        # Zustand global state
     ├─ screens/      # Create, List, Detail ekranları
     └─ types/        # TypeScript tipleri (Cargo tipleri)

------------------------------------------------------------------------

## 🔧 Kirlilik Üretimi

Veri üretim algoritması aşağıdaki kurallara göre çalışır:

-   %5 → `status = null`
-   %10 → `kg = null`
-   Negatif fiyatlar → belirlenen aralıkta rastgele üretilir
-   `id` → UUID v4 formatında
-   `name` → 8-16 karakter alfanumerik (A-Z, a-z, 0-9)

``` ts
if (Math.random() < 0.05) status = null;
if (Math.random() < 0.10) kg = null;
if (Math.random() < 0.10) price = -Math.floor(Math.random() * 100);
```

------------------------------------------------------------------------

## 🧹 Temizleme Stratejisi

Aşağıdaki kayıtlar atılır:

-   `status = null`
-   `category` geçersiz
-   `price < 0`
-   `kg = null`

``` ts
const filtered = cargos.filter(
  (c) => c.status !== null && c.kg !== null && c.price >= 0
);
```

------------------------------------------------------------------------

## 📋 Listeleme & Filtreleme

-   **Kirli kayıtlar** → kırmızı arka plan ile işaretlenir\
-   **Temizleme sonrası** → yalnızca geçerli kayıtlar listelenir\
-   **Filtreleme** → kategori, kilo aralığı, fiyat aralığı\
-   **Arama** → `name` alanında case-sensitive\
-   **Sayaç** → toplam kayıt / filtre sonucu

------------------------------------------------------------------------

## 🔎 Detay Ekranı

-   Gösterilen alanlar:
    `id, name, category, price, status, kg, createdAt`\
-   Kirli alanlar **kırmızı renkle vurgulanır**\
-   Temizleme sonrası yalnızca geçerli veriler kalır

------------------------------------------------------------------------

## ⚡ Performans Ölçümleri

  ------------------------------------------------------------------------
  Kayıt Sayısı Üretim Süresi(ms)  Temizleme Süresi(ms) Render Süresi(ms)                
  ------------ ------------------ -------------------- -------------------
  100          21                 0                    277

  1.000        169                0                    277

  10.000       1678               1                    279
  ------------------------------------------------------------------------

------------------------------------------------------------------------

## ⚠ Error Handling Stratejisi

-   **Veri Üretimi**: geçersiz parametre, bellek yetersizliği\
-   **Temizleme**: corrupt data, timeout\
-   **Listeleme**: render hataları, filtreleme exceptions\
-   **Arama**: geçersiz regex, performans sorunları\
-   **State**: Zustand action failures

Çözümler:\
- `try/catch` blokları\
- Error Boundaries\
- Hata loglama (console + UI feedback)

------------------------------------------------------------------------

## 🗂 State Management

### Store Yapısı (Zustand)

``` ts
interface CargoState {
  cargos: RawCargo[];
  cleanCargos: RawCargo[];
  createData: (count: number) => void;
  cleanData: () => void;
  reset: () => void;
}
```

-   `cargos` → kirli veriler\
-   `cleanCargos` → temizlenmiş veriler\
-   `createData` → veri üretimi\
-   `cleanData` → filtreleme (temizleme)\
-   `reset` → sıfırlama

------------------------------------------------------------------------