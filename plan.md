# YouTube Rakip Analiz Sistemi — Pipeline ve Teknik Plan

Bu doküman, mevcut SaaS projesine YouTube Rakip Analiz Sistemi eklemek için hazırlanmıştır.

## Sistem Hedefi

Kullanıcı bir YouTube kanal URL'si girer.

Sistem:
- Kanal verilerini toplar
- Son videoları analiz eder
- Viral videoları tespit eder
- Başlık patternlerini analiz eder
- Shorts / long-form ayrımı yapar
- İçerik fırsatlarını çıkarır
- Stratejik rakip raporu oluşturur

---

## Genel Pipeline

```txt
User Input
   ↓
Input Validation
   ↓
Channel Resolver
   ↓
Cache Check
   ↓
YouTube API Fetch
   ↓
Data Normalization
   ↓
Metrics Calculation
   ↓
Performance Analysis
   ↓
Viral Detection
   ↓
Title Analysis
   ↓
Content Classification
   ↓
Upload Frequency Analysis
   ↓
Opportunity Detection
   ↓
Report Generation
   ↓
Dashboard Rendering
   ↓
Export System
```

---

## Input Pipeline

Desteklenen input türleri:

- https://www.youtube.com/@channel
- https://www.youtube.com/channel/UCxxxx
- https://www.youtube.com/c/channelname
- @channel
- kanal adı

Pipeline:

```txt
Raw Input
   ↓
validateYoutubeInput()
   ↓
normalizeYoutubeInput()
   ↓
resolveChannelId()
   ↓
channelId
```

---

## API Pipeline

```txt
channelId
   ↓
fetchChannelDetails()
   ↓
fetchUploadsPlaylist()
   ↓
fetchPlaylistVideos()
   ↓
fetchVideoDetails()
   ↓
rawChannelData + rawVideoData
```

---

## Cache Pipeline

```txt
channelId
   ↓
checkCache()
   ↓
cache hit?
   ├── yes → return cached report
   └── no
          ↓
     run analysis pipeline
          ↓
     saveToCache()
```

MVP:
- memory cache
- 24 saat TTL

---

## Metrics Pipeline

```txt
videos[]
   ↓
calculateAverageViews()
   ↓
calculateMedianViews()
   ↓
calculateAverageDuration()
   ↓
calculateUploadFrequency()
   ↓
calculateShortsRatio()
   ↓
channelMetrics
```

---

## Viral Detection Pipeline

```txt
videoPerformanceMetrics[]
   ↓
compareAgainstAverage()
   ↓
compareAgainstMedian()
   ↓
detectOutlier()
   ↓
viralVideos[]
```

Kural:

- performanceScore >= 3
veya
- outlierScore >= 4

---

## Title Analysis Pipeline

```txt
video.title
   ↓
normalizeTitle()
   ↓
detectPatterns()
   ↓
groupByPattern()
   ↓
calculatePatternPerformance()
   ↓
titlePatterns[]
```

Patternler:
- number titles
- VS titles
- question titles
- Top/Best/Worst
- year in title
- clickbait words

---

## Content Classification Pipeline

Formatlar:
- Comparison
- Ranking
- Timeline
- Tutorial
- Documentary
- Data Visualization
- Top List
- Shorts Clip

---

## Opportunity Detection Pipeline

```txt
channelMetrics
+ titlePatterns
+ viralVideos
+ contentFormatInsights
   ↓
detectWinningPatterns()
   ↓
detectContentGaps()
   ↓
generateContentIdeas()
   ↓
opportunityReport
```

---

## UI Route

```txt
/dashboard/competitor-analysis
```

Bölümler:
- Search form
- Channel overview
- Metrics cards
- Video table
- Viral videos
- Title insights
- Upload charts
- Opportunity report
- Export buttons

---

## Dosya Yapısı

```txt
src/
 ├── features/
 │    └── competitor-analysis/
 │         ├── api/
 │         ├── analysis/
 │         ├── components/
 │         ├── hooks/
 │         ├── pages/
 │         ├── types/
 │         ├── utils/
 │         └── exports/
```

---

## MVP Özellikleri

- Kanal URL input
- Channel resolver
- Video fetch
- Metrics calculation
- Viral detection
- Shorts detection
- Title analysis
- Upload analysis
- Content format classification
- Opportunity report
- JSON export
- CSV export
- Loading/error states

---

## Testler

- URL parser
- duration parser
- average/median calculation
- performance score
- viral detection
- shorts detection
- title analysis
- upload frequency

---

## Claude Code Implementation Order

1. Feature klasörü oluştur
2. Type dosyalarını yaz
3. URL parser yaz
4. YouTube API client yaz
5. Cache utility oluştur
6. Fetch fonksiyonlarını yaz
7. Metrics fonksiyonlarını yaz
8. Viral detection yaz
9. Title analyzer yaz
10. Content classifier yaz
11. Opportunity generator yaz
12. API route oluştur
13. Dashboard UI oluştur
14. Export sistemi ekle
15. Testleri yaz
16. Build/lint çalıştır
17. Hataları düzelt

---

## Nihai Hedef

```txt
Kanal URL'si gir
      ↓
Rakip analiz raporu oluştur
      ↓
Başarılı patternleri bul
      ↓
İçerik fırsatlarını keşfet
      ↓
Kendi kanal stratejini geliştir
```
