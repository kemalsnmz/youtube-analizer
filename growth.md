# YouTube Growth Intelligence SaaS — İnşa Planı ve Pipeline

Bu doküman, YouTube içerik üreticileri için tasarlanacak **YouTube Growth Intelligence SaaS** ürününü inşa etmek için hazırlanmıştır.

Ürün odağı:

> Video üretmek değil; YouTube kanallarını analiz etmek, rakipleri incelemek, viral patternleri bulmak, kanalın neden büyüdüğünü veya neden büyümediğini açıklamak ve içerik üreticisine uygulanabilir büyüme stratejisi sunmak.

Referans alınan ürün mantıkları:

- 1of10: Outlier video discovery, viral idea discovery, competitor tracking
- vidIQ: YouTube SEO, channel audit, keyword/trend intelligence
- TubeBuddy: YouTube optimization workflow
- OutlierKit: Outlier detection, hook analysis, growth opportunity analysis
- Xpatla tarzı sistemler: Insight → action workflow simplification

Amaç birebir kopya yapmak değil; aynı problemi çözen, özgün ve daha stratejik çalışan bir sistem kurmaktır.

---

# 1. Ürün Konumlandırması

Ürün şu şekilde konumlanmalı:

```txt
YouTube Studio + Rakip Analiz Uzmanı + AI Growth Strategist
```

Kullanıcı bu ürüne şu soruların cevabını almak için gelir:

- Kanalım neden büyümüyor?
- Rakiplerim hangi videolarla büyüyor?
- Hangi başlık formatları daha iyi çalışıyor?
- Hangi thumbnail tarzları daha çok izleniyor?
- Hangi içerik formatlarını tekrar etmeliyim?
- Bir sonraki videom ne olmalı?
- Hangi rakip video outlier performans göstermiş?
- Bu nişte hangi fırsatlar var?

---

# 2. Ana Ürün Modülleri

Sistem aşağıdaki ana modüllerden oluşmalıdır:

```txt
1. Channel Analyzer
2. Competitor Intelligence
3. Outlier Finder
4. Title Intelligence
5. Thumbnail Intelligence
6. Content Format Intelligence
7. Upload Frequency Analyzer
8. Growth Diagnosis
9. Opportunity Engine
10. AI Growth Strategist
11. Report & Export System
12. Alert & Tracking System
```

---

# 3. Genel Sistem Pipeline

```txt
User Input
   ↓
Channel Resolver
   ↓
Data Fetch Layer
   ↓
Snapshot Storage
   ↓
Data Normalization
   ↓
Metrics Engine
   ↓
Outlier Detection Engine
   ↓
Pattern Recognition Engine
   ↓
Content Format Engine
   ↓
Growth Diagnosis Engine
   ↓
Opportunity Engine
   ↓
AI Strategist Engine
   ↓
Creator Dashboard
   ↓
Report Export
```

---

# 4. Kullanıcı Akışı

## 4.1 İlk Kullanıcı Akışı

```txt
Kullanıcı kanal URL'si girer
      ↓
Sistem kanal ID'sini çözer
      ↓
Kanal bilgilerini çeker
      ↓
Son 50-100 videoyu analiz eder
      ↓
Kanal health score üretir
      ↓
Outlier videoları bulur
      ↓
Başlık ve içerik patternlerini çıkarır
      ↓
Growth diagnosis raporu üretir
      ↓
İçerik fırsatları önerir
```

## 4.2 Rakip Analiz Akışı

```txt
Kullanıcı rakip kanal ekler
      ↓
Sistem rakibin son videolarını analiz eder
      ↓
Rakibin en iyi çalışan formatlarını bulur
      ↓
Outlier videoları listeler
      ↓
Kullanıcının kanalına göre fırsat farklarını çıkarır
```

## 4.3 AI Strategist Akışı

```txt
Kullanıcı soru sorar
      ↓
Sistem kanal + rakip + video verilerini context olarak kullanır
      ↓
AI growth strategist cevap üretir
      ↓
Cevap veri destekli öneriler içerir
```

Örnek sorular:

```txt
Kanalım neden büyümüyor?
Bu hafta hangi videoyu çekmeliyim?
Rakiplerimden nasıl ayrışırım?
Bu başlık iyi mi?
Bu video fikrinin potansiyeli var mı?
```

---

# 5. Teknik Mimari

Önerilen genel mimari:

```txt
Frontend
  Next.js / React / TypeScript

Backend
  Next.js API Routes veya Node.js API layer

Database
  PostgreSQL

Cache
  Redis veya başlangıçta in-memory cache

External APIs
  YouTube Data API
  AI Provider API

Storage
  Thumbnail metadata
  Video snapshots
  Channel snapshots
```

---

# 6. Önerilen Dosya Yapısı

```txt
src/
 ├── features/
 │    └── youtube-growth/
 │         ├── api/
 │         ├── analysis/
 │         ├── ai/
 │         ├── components/
 │         ├── types/
 │         ├── utils/
 │         └── exports/
 │
 ├── lib/
 │    ├── youtube/
 │    ├── database/
 │    └── cache/
```

Detaylı yapı:

```txt
src/features/youtube-growth/
 ├── analysis/
 │    ├── channel-health.ts
 │    ├── video-performance.ts
 │    ├── outlier-detection.ts
 │    ├── title-patterns.ts
 │    ├── thumbnail-patterns.ts
 │    ├── content-format.ts
 │    ├── upload-frequency.ts
 │    ├── growth-diagnosis.ts
 │    └── opportunity-engine.ts
 │
 ├── ai/
 │    ├── ai-growth-strategist.ts
 │    ├── prompt-builder.ts
 │    ├── report-generator.ts
 │    └── idea-generator.ts
 │
 ├── components/
 │    ├── ChannelSearchForm.tsx
 │    ├── ChannelOverviewCard.tsx
 │    ├── ChannelHealthScore.tsx
 │    ├── VideoPerformanceTable.tsx
 │    ├── OutlierVideosGrid.tsx
 │    ├── TitlePatternsPanel.tsx
 │    ├── ContentFormatInsights.tsx
 │    ├── UploadFrequencyChart.tsx
 │    ├── GrowthDiagnosisReport.tsx
 │    ├── OpportunityPanel.tsx
 │    ├── AIStrategistChat.tsx
 │    └── ExportButtons.tsx
```

---

# 7. Veri Modelleri

## Channel

```ts
export type Channel = {
  id: string;
  youtubeChannelId: string;
  title: string;
  description?: string;
  customUrl?: string;
  country?: string;
  thumbnailUrl?: string;
  subscriberCount?: number;
  totalViewCount?: number;
  videoCount?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};
```

## Video

```ts
export type Video = {
  id: string;
  youtubeVideoId: string;
  channelId: string;
  title: string;
  description?: string;
  publishedAt: string;
  durationSeconds: number;
  viewCount: number;
  likeCount?: number;
  commentCount?: number;
  thumbnailUrl?: string;
  url: string;
  isShort: boolean;
  createdAt: string;
  updatedAt: string;
};
```

## VideoSnapshot

```ts
export type VideoSnapshot = {
  id: string;
  videoId: string;
  title: string;
  thumbnailUrl?: string;
  viewCount: number;
  likeCount?: number;
  commentCount?: number;
  capturedAt: string;
};
```

## VideoPerformanceMetrics

```ts
export type VideoPerformanceMetrics = {
  videoId: string;
  viewsPerDay: number;
  engagementRate: number;
  performanceScore: number;
  outlierScore: number;
  isOutlier: boolean;
  isViralOutlier: boolean;
};
```

## ChannelAnalysisReport

```ts
export type ChannelAnalysisReport = {
  channel: Channel;
  videos: Video[];
  topVideos: Video[];
  recentVideos: Video[];
  outlierVideos: Video[];
  averageViews: number;
  medianViews: number;
  averageDurationSeconds: number;
  uploadFrequencyPerWeek: number;
  shortsRatio: number;
  longFormRatio: number;
  healthScore: number;
  titlePatterns: TitlePattern[];
  contentFormats: ContentFormatInsight[];
  growthDiagnosis: GrowthDiagnosis;
  opportunities: ContentOpportunity[];
};
```

---

# 8. YouTube Data Pipeline

## 8.1 Input Normalize

Desteklenecek inputlar:

```txt
https://www.youtube.com/@channel
https://www.youtube.com/channel/UCxxxx
https://www.youtube.com/c/channelname
https://www.youtube.com/user/channelname
@channel
channel name
```

Pipeline:

```txt
raw input
   ↓
validateYoutubeInput()
   ↓
normalizeYoutubeInput()
   ↓
resolveChannelId()
   ↓
channelId
```

## 8.2 Fetch Pipeline

```txt
channelId
   ↓
fetchChannelDetails()
   ↓
fetchUploadsPlaylist()
   ↓
fetchPlaylistVideos(maxVideos)
   ↓
fetchVideoDetails(videoIds)
   ↓
raw dataset
```

## 8.3 Normalize Pipeline

```txt
raw YouTube API data
   ↓
normalizeChannel()
   ↓
normalizeVideos()
   ↓
parseDuration()
   ↓
detectShorts()
   ↓
normalized dataset
```

---

# 9. Metrics Engine

## 9.1 Kanal Metrikleri

Hesaplanacaklar:

```txt
averageViews
medianViews
maxViews
minViews
averageDurationSeconds
uploadFrequencyPerWeek
uploadFrequencyPerMonth
shortsRatio
longFormRatio
consistencyScore
```

## 9.2 Video Metrikleri

```txt
viewsPerDay
engagementRate
performanceScore
outlierScore
```

Formüller:

```txt
performanceScore = video.viewCount / channelAverageViews
outlierScore = video.viewCount / channelMedianViews
engagementRate = (likeCount + commentCount) / viewCount
viewsPerDay = viewCount / daysSincePublished
```

---

# 10. Outlier Detection Engine

Bu sistem ürünün en önemli parçalarından biridir.

## 10.1 Temel Kural

```txt
Eğer video kanal ortalamasının 3 katından fazla izlendiyse outlier kabul edilir.
Eğer video kanal median değerinin 4 katından fazla izlendiyse strong outlier kabul edilir.
```

## 10.2 Outlier Seviyeleri

```txt
1x - 2x   = Normal
2x - 3x   = Above Average
3x - 5x   = Outlier
5x - 10x  = Strong Outlier
10x+      = Viral Outlier
```

## 10.3 Kullanım Alanları

Outlier videolar:

- rakip analizi
- fikir üretimi
- title pattern analizi
- thumbnail pattern analizi
- content opportunity üretimi

için kullanılmalıdır.

---

# 11. Title Intelligence Engine

Başlıklar sadece gösterilmemeli, pattern çıkarılmalıdır.

## 11.1 Tespit Edilecek Patternler

```txt
number-based title
question title
comparison title
VS title
how-to title
why title
top/best/worst title
year in title
negative curiosity
positive promise
clickbait phrase
short title
long title
```

## 11.2 Örnek Çıktılar

```txt
"VS" başlıklı videolar ortalamanın 2.4 katı performans gösteriyor.
Başlığında yıl geçen videolar %38 daha iyi izleniyor.
"How to" başlıkları bu kanalda zayıf çalışıyor.
```

---

# 12. Thumbnail Intelligence Engine

## 12.1 MVP Kapsamı

İlk sürümde:

```txt
top performing thumbnails grid
outlier thumbnails grid
thumbnail comparison view
thumbnail URL storage
```

## 12.2 V2 Kapsamı

Sonraki sürümde:

```txt
dominant color analysis
contrast score
face detection
text detection
object detection
thumbnail change history
similar thumbnail search
```

## 12.3 Snapshot Mantığı

Thumbnail değişimlerini takip etmek için video snapshot sistemi kurulmalıdır.

```txt
videoId
title
thumbnailUrl
viewCount
capturedAt
```

---

# 13. Content Format Intelligence

Video başlığı, açıklama ve süreye göre format sınıflandırması yapılmalıdır.

## 13.1 Formatlar

```txt
Comparison
Ranking
Tutorial
Documentary
Explained
News
Reaction
Review
Listicle
Case Study
Challenge
Shorts Clip
Analysis
```

## 13.2 Çıktılar

```txt
Format adı
Video sayısı
Average views
Median views
En başarılı video
Outlier oranı
Tekrar edilebilirlik skoru
```

---

# 14. Upload Frequency Analyzer

Analiz edilecekler:

```txt
weekly upload rate
monthly upload rate
last 30 days uploads
last 60 days uploads
last 90 days uploads
most active publishing days
most active publishing hours
upload consistency score
```

Örnek çıktı:

```txt
Kanal son 60 günde upload sıklığını %45 düşürmüş.
Bu düşüş izlenme performansındaki düşüşle aynı döneme denk geliyor.
```

---

# 15. Growth Diagnosis Engine

Bu modül ürünün en stratejik bölümüdür.

## 15.1 Analiz Soruları

```txt
Kanal büyüyor mu?
Kanal düşüşte mi?
Upload düzeni bozulmuş mu?
En iyi çalışan formatlar terk edilmiş mi?
Kanal çok fazla konuya mı dağılmış?
Shorts performansı long-form'dan iyi mi?
Title patternleri tekrara mı düşmüş?
Rakipler hangi konuda öne geçmiş?
```

## 15.2 Örnek Çıktı

```txt
Kanalın son 90 günde performansı düşmüş.
Ana sebepler:
1. Upload sıklığı azalmış.
2. En iyi çalışan "comparison" formatı bırakılmış.
3. Son 10 videoda konu odağı dağılmış.
4. Outlier üreten başlık patternleri tekrar kullanılmamış.
```

---

# 16. Opportunity Engine

Bu modül kullanıcının "ne üretmeliyim?" sorusuna cevap verir.

## 16.1 Inputlar

```txt
channel metrics
competitor outliers
title patterns
content formats
upload insights
growth diagnosis
```

## 16.2 Çıktı Tipi

```ts
export type ContentOpportunity = {
  id: string;
  title: string;
  reason: string;
  confidence: "low" | "medium" | "high";
  sourceVideos: string[];
  suggestedTitles: string[];
  thumbnailBrief?: string;
  recommendedFormat: string;
};
```

## 16.3 Örnek Fırsat

```txt
Fırsat: Rakiplerde "X vs Y" formatı güçlü çalışıyor.

Sebep:
Son 30 günde 4 rakip video bu formatta 5x+ outlier olmuş.

Önerilen video başlıkları:
- X vs Y: Hangisi Daha Mantıklı?
- 2026'da X mi Y mi?
- X'in Y'ye Karşı Büyük Avantajı
```

---

# 17. AI Growth Strategist

Bu katman AI destekli danışman sistemidir.

## 17.1 Amaç

Kullanıcıya genel cevap değil, veri destekli stratejik cevap vermek.

## 17.2 Context

AI cevap verirken şu verileri kullanmalıdır:

```txt
channel report
video performance metrics
outlier videos
title patterns
content formats
competitor insights
opportunity report
```

## 17.3 Örnek Sistem Prompt

```txt
Sen bir YouTube growth strategist'sin.
Aşağıdaki kanal verilerini analiz ederek kullanıcıya uygulanabilir büyüme önerileri ver.
Genel tavsiye verme.
Her öneriyi veriyle destekle.
```

---

# 18. Dashboard Yapısı

Ana route:

```txt
/dashboard/youtube-growth
```

Dashboard bölümleri:

```txt
1. Analyze Channel Form
2. Channel Overview
3. Channel Health Score
4. Key Metrics Cards
5. Top Performing Videos
6. Outlier Videos
7. Shorts vs Long-form Analysis
8. Upload Frequency Chart
9. Title Pattern Insights
10. Content Format Insights
11. Growth Diagnosis Report
12. Opportunity Panel
13. AI Strategist Chat
14. Export Buttons
```

---

# 19. API Route Tasarımı

## 19.1 Kanal Analiz

```txt
POST /api/youtube-growth/analyze-channel
```

Request:

```json
{
  "channelUrl": "https://www.youtube.com/@example",
  "maxVideos": 100
}
```

## 19.2 Rakip Analiz

```txt
POST /api/youtube-growth/analyze-competitor
```

## 19.3 AI Strategist

```txt
POST /api/youtube-growth/ask-strategist
```

Request:

```json
{
  "question": "Kanalım neden büyümüyor?",
  "channelId": "internal-channel-id"
}
```

---

# 20. Cache Sistemi

## 20.1 MVP

```txt
in-memory cache
24 saat TTL
channelId bazlı cache
```

## 20.2 Production

```txt
Redis
database cache
scheduled refresh
```

Cache key örnekleri:

```txt
youtube-growth:channel:{channelId}
youtube-growth:videos:{channelId}
youtube-growth:report:{channelId}
```

---

# 21. Snapshot Sistemi

Bu sistem V2 için çok önemlidir ama veri modeli baştan kurulmalıdır.

## 21.1 Neden Gerekli?

Snapshot sayesinde:

```txt
video growth chart
title change detection
thumbnail change detection
competitor tracking
viral alert
```

yapılabilir.

## 21.2 Snapshot Pipeline

```txt
Tracked Channel
   ↓
Scheduled fetch
   ↓
Current video stats
   ↓
Compare previous snapshot
   ↓
Save new snapshot
   ↓
Detect changes
   ↓
Generate alerts
```

---

# 22. Alert Sistemi

V2'de eklenecek.

Alert örnekleri:

```txt
Rakip yeni video yayınladı.
Rakibin videosu 24 saatte beklenenden hızlı büyüyor.
Rakip thumbnail değiştirdi.
Rakip title değiştirdi.
Rakip yeni outlier video üretti.
```

---

# 23. Export Sistemi

MVP export türleri:

```txt
JSON export
CSV export
```

V2 export türleri:

```txt
PDF report
Notion-style report
Google Sheets export
```

CSV dosyaları:

```txt
videos.csv
outlier-videos.csv
title-patterns.csv
content-formats.csv
opportunities.csv
```

---

# 24. Error Handling

Desteklenecek hata türleri:

```txt
INVALID_YOUTUBE_URL
CHANNEL_NOT_FOUND
YOUTUBE_API_KEY_MISSING
YOUTUBE_API_QUOTA_EXCEEDED
FETCH_FAILED
NOT_ENOUGH_VIDEOS
AI_PROVIDER_ERROR
UNKNOWN_ERROR
```

Kullanıcıya teknik hata değil, anlaşılır mesaj gösterilmelidir.

Örnek:

```txt
Bu kanal analiz edilemedi. Kanal gizli olabilir, URL hatalı olabilir veya YouTube API limiti dolmuş olabilir.
```

---

# 25. MVP Kapsamı

İlk sürümde kesin yapılacaklar:

```txt
[ ] Channel URL input
[ ] YouTube channel resolver
[ ] Channel details fetch
[ ] Last 50-100 video fetch
[ ] Video statistics fetch
[ ] Data normalization
[ ] Average/median views calculation
[ ] Performance score calculation
[ ] Outlier score calculation
[ ] Viral/outlier detection
[ ] Shorts vs long-form detection
[ ] Upload frequency analysis
[ ] Title pattern analysis
[ ] Content format classification
[ ] Growth diagnosis report
[ ] Opportunity generation
[ ] AI strategist summary
[ ] Dashboard UI
[ ] JSON export
[ ] CSV export
[ ] Loading state
[ ] Error state
```

---

# 26. MVP Dışında Bırakılacaklar

İlk sürümde yapılmayacaklar:

```txt
[ ] Automated video generation
[ ] YouTube video upload
[ ] Advanced thumbnail AI vision
[ ] Transcript hook analysis
[ ] Comment sentiment analysis
[ ] Real-time alert system
[ ] Scheduled competitor tracking
[ ] PDF export
[ ] Multi-user team workspace
[ ] Billing system
```

---

# 27. V2 Roadmap

```txt
[ ] Competitor tracking list
[ ] Bookmark system
[ ] Video growth charts
[ ] Historical snapshots
[ ] Title change detection
[ ] Thumbnail change detection
[ ] Viral video alerts
[ ] Similar title search
[ ] Similar thumbnail search
[ ] PDF export
```

---

# 28. V3 Roadmap

```txt
[ ] Niche explorer
[ ] Trend prediction
[ ] Low competition topic finder
[ ] High RPM topic scoring
[ ] Transcript hook analysis
[ ] Thumbnail AI analysis
[ ] Content calendar
[ ] Team collaboration
[ ] Scheduled reports
[ ] Email alerts
```

---

# 29. Test Planı

Test yazılacak alanlar:

```txt
YouTube URL parser
Duration parser
Shorts detection
Average calculation
Median calculation
Performance score
Outlier score
Viral detection
Title pattern detection
Content format classification
Upload frequency calculation
Opportunity generation
```

---

# 30. Performans ve Güvenlik Kuralları

```txt
YouTube API key client tarafına sızmamalı.
Tüm YouTube API çağrıları server-side yapılmalı.
Aynı kanal tekrar analiz edilirse cache kullanılmalı.
Video detail fetch batch yapılmalı.
Analysis fonksiyonları pure function olmalı.
Render içinde data fetch yapılmamalı.
AI promptlarına gereksiz büyük veri gönderilmemeli.
Kullanıcı inputları validate edilmeli.
Database query'leri optimize edilmeli.
```

---

# 31. Claude Code İçin Ana Talimat

```txt
YouTube içerik üreticileri için bir YouTube Growth Intelligence SaaS geliştiriyorum.

Bu ürün video üretmeyecek.
Ana amacı YouTube kanallarını analiz etmek, rakipleri takip etmek, outlier videoları bulmak, title/thumbnail/content patternlerini analiz etmek ve içerik üreticisine kanalını nasıl geliştireceğine dair stratejik öneriler vermektir.

Referans ürün mantıkları:
- 1of10: outlier video discovery, viral idea discovery, competitor tracking
- vidIQ: YouTube SEO, channel audit, keyword/trend intelligence
- TubeBuddy: optimization workflow
- OutlierKit: hook analysis, outlier detection, competitor analysis

Birebir kopyalama yapma.
Aynı problemi çözen özgün, production-ready bir sistem kur.

MVP hedefi:
Kullanıcı bir YouTube kanal URL'si girsin.
Sistem kanalı analiz etsin ve stratejik growth report oluştursun.

MVP özellikleri:
1. Channel URL input
2. YouTube channel resolver
3. Channel details fetch
4. Last 50-100 videos fetch
5. Video statistics fetch
6. Average/median views calculation
7. Outlier score calculation
8. Viral video detection
9. Shorts vs long-form detection
10. Upload frequency analysis
11. Title pattern analysis
12. Content format classification
13. Growth diagnosis report
14. Opportunity generation
15. AI growth strategist summary
16. Dashboard UI
17. JSON/CSV export

Önemli:
- YouTube API key client tarafına sızmamalı.
- YouTube API çağrıları server-side yapılmalı.
- Aynı kanal tekrar analiz edilirse cache kullanılmalı.
- Analysis fonksiyonları küçük, test edilebilir ve typed olmalı.
- Büyük monolitik component yazma.
- Mevcut projeyi bozma.
- TypeScript strict uyumlu yaz.
- Build/lint hatası bırakma.
```

---

# 32. Claude Code Implementation Order

```txt
1. Proje yapısını incele
2. Mevcut routing/dashboard mimarisini bul
3. youtube-growth feature klasörünü oluştur
4. TypeScript type dosyalarını ekle
5. YouTube URL parser ekle
6. YouTube API client ekle
7. Channel resolver fonksiyonunu ekle
8. Channel fetch fonksiyonunu ekle
9. Video fetch fonksiyonunu ekle
10. Video detail batch fetch ekle
11. Normalize fonksiyonlarını ekle
12. Metrics engine ekle
13. Outlier detection engine ekle
14. Title pattern engine ekle
15. Content format classifier ekle
16. Upload frequency analyzer ekle
17. Growth diagnosis generator ekle
18. Opportunity generator ekle
19. AI strategist summary generator ekle
20. API route oluştur
21. Dashboard sayfasını oluştur
22. UI componentlerini ekle
23. Export JSON/CSV fonksiyonlarını ekle
24. Loading/error state ekle
25. Unit testleri yaz
26. Build çalıştır
27. Lint çalıştır
28. Hataları düzelt
29. Final implementation summary hazırla
```

---

# 33. MVP Kabul Kriterleri

```txt
[ ] Kullanıcı kanal URL'si girebiliyor
[ ] Kanal bilgileri çekiliyor
[ ] Son 50-100 video çekiliyor
[ ] Video detayları ve istatistikleri geliyor
[ ] Average views hesaplanıyor
[ ] Median views hesaplanıyor
[ ] Performance score hesaplanıyor
[ ] Outlier score hesaplanıyor
[ ] Viral/outlier videolar işaretleniyor
[ ] Shorts/long-form ayrımı yapılıyor
[ ] Upload frequency hesaplanıyor
[ ] Title patternleri çıkarılıyor
[ ] Content formatları sınıflandırılıyor
[ ] Growth diagnosis raporu üretiliyor
[ ] Opportunity report üretiliyor
[ ] AI strategist summary oluşturuluyor
[ ] Dashboard düzgün render ediliyor
[ ] JSON export çalışıyor
[ ] CSV export çalışıyor
[ ] Loading state var
[ ] Error state var
[ ] TypeScript hatası yok
[ ] Lint hatası yok
[ ] Mevcut proje bozulmuyor
```

---

# 34. Nihai Ürün Vizyonu

Bu ürün sıradan bir YouTube analytics paneli olmamalıdır.

Nihai hedef:

```txt
YouTube içerik üreticisinin karar motoru olmak.
```

Kullanıcı bu ürünü açtığında sadece veri görmemeli.

Şunu görmeli:

```txt
Ne çalışıyor?
Neden çalışıyor?
Ben ne yapmalıyım?
Bir sonraki videom ne olmalı?
Rakiplerimden nasıl ayrışırım?
```

Bu nedenle ürünün ana değeri:

```txt
Raw analytics → Strategic intelligence → Actionable recommendations
```

olmalıdır.
