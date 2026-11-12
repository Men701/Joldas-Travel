import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Check, Compass, Globe2, Map, MapPin,
  MessageCircle, Search, ShieldCheck, Sparkles, Users, Wallet,
} from "lucide-react";
import { api, ChatMessage, Expense, getToken, ItineraryItem, Profile, setToken, Trip } from "./api";

type Language = "ru" | "kk" | "en";

const copy = {
  ru: {
    navTrips: "Найти поездку", navPeople: "Попутчики", navMap: "Карта", navHow: "Как это работает",
    signIn: "Войти", signUp: "Создать аккаунт", signOut: "Выйти", heroEyebrow: "ПУТЕШЕСТВУЙ ВМЕСТЕ · КАЗАХСТАН",
    heroTitle: "Новые места. Свои люди.", heroText: "Находи попутчиков, собирай компанию и открывай Казахстан — не в одиночку.",
    explore: "Найти поездку", makeTrip: "Создать поездку", searchTitle: "Куда отправимся?",
    searchHint: "Найди компанию по направлению, датам и бюджету", destination: "Куда", destinationPlaceholder: "Город или место",
    dates: "Даты поездки", anyDates: "Любые даты", dateFrom: "С", dateTo: "По", budget: "Бюджет на человека", budgetPlaceholder: "До, ₸",
    interests: "Интересы", interestsPlaceholder: "Хайкинг, природа…", search: "Показать поездки",
    trustedNote: "Без комиссий и бронирования — только люди и планы", popular: "С чего начнём?",
    communityPhotoAlt: "Попутчики вместе отдыхают у моря", communityCaption: "Впечатления лучше разделять",
    popularText: "Идеи для следующей поездки по Казахстану", allPlaces: "Все направления",
    placeAlmaty: "Алматы и горы", placeAlmatyText: "Тропы, озёра и выходные в горах", tripFull: "Набор закрыт", tripOpen: "НАБОР ОТКРЫТ",
    placeKolsai: "Кольсай и Каинды", placeKolsaiText: "Бирюзовые озёра среди Тянь-Шаня",
    placeCharyn: "Чарынский каньон", placeCharynText: "Маршрут на выходные к каньону",
    placeTurkistan: "Туркестан", placeTurkistanText: "История, архитектура и юг страны",
    placeBozzhyra: "Плато Бозжыра", placeBozzhyraText: "Белые скалы и простор Мангистау",
    placeBurabay: "Бурабай", placeBurabayText: "Озёра, сосновый лес и скала Окжетпес",
    placeAltynEmel: "Алтын-Эмель", placeAltynEmelText: "Поющие дюны и степные пейзажи",
    placeBayanaul: "Баянаул", placeBayanaulText: "Горные озёра и прогулочные тропы",
    discover: "Смотреть поездки", tripSection: "Открытые поездки", tripSectionText: "Реальные планы участников сообщества",
    noTrips: "Пока нет открытых поездок", noTripsText: "Создай первую поездку — и найди людей, которым по пути.",
    createFirst: "Создать поездку", companionEyebrow: "НЕ ЕДЬ ОДИН", peopleTitle: "Попутчики с похожими планами",
    peopleText: "Смотри, кто собирается в поездку, и присоединяйся к группе. После вступления откроется общий чат.",
    seeTrip: "Открыть поездку", noPeople: "Попутчики появятся здесь вместе с открытыми поездками.",
    howTitle: "Путешествие начинается с простого плана", howText: "От идеи до общего чата — всё необходимое в одном месте.",
    useSearch: "Перейти к поиску", mapEyebrow: "МАРШРУТЫ ВДОХНОВЛЯЮТ", mapTitle: "От Алматы — к озёрам Тянь-Шаня",
    mapText: "Посмотри маршрут на открытой карте. Это ориентир для планирования, а не навигация в реальном времени.",
    openMap: "Открыть карту OpenStreetMap", routeStart: "Алматы", routeStopOne: "Кольсай", routeStopTwo: "Каинды",
    audienceEyebrow: "ДЛЯ ТЕХ, КТО ХОЧЕТ В ПУТЬ", audienceTitle: "Планы разные — интерес к путешествиям общий",
    audienceText: "Joldas особенно полезен, если хочется открыть новое место, а в знакомом кругу пока не нашлось попутчиков.",
    audienceStudent: "Студентам", audienceStudentText: "Найти компанию на выходные и заранее обсудить примерный бюджет.",
    audienceYoung: "Молодым специалистам", audienceYoungText: "Согласовать даты, интересы и короткий маршрут с новой группой.",
    audienceSolo: "Самостоятельным путешественникам", audienceSoloText: "Поделиться планами с группой вместо того, чтобы организовывать поездку в одиночку.",
    audienceNote: "Это типичные сценарии использования, а не статистика или реальные профили пользователей.",
    journeyEyebrow: "ОДНА ИДЕЯ — ОБЩИЙ МАРШРУТ", journeyTitle: "Из города — к новым впечатлениям",
    journeyText: "Маршрутная иллюстрация показывает идею поездки через Чарын к озёрам. Точки и линия здесь — вдохновение, а не проверенная навигация.",
    journeyAlmaty: "Алматы", journeyCharyn: "Чарын", journeyKolsai: "Көлсай", journeyKaindy: "Қайыңды",
    journeyCaption: "Пример маршрута · проверьте дорогу, погоду и местные правила перед выездом",
    stepOne: "Заполни профиль", stepOneText: "Укажи интересы и бюджет, чтобы другим путешественникам было проще понять, совпадают ли ваши планы.",
    stepTwo: "Найди или создай поездку", stepTwoText: "Выбери направление и даты либо опубликуй собственный план.",
    stepThree: "Познакомься и спланируй", stepThreeText: "Вступи в группу, затем обсудите маршрут и примерные расходы в общем чате.",
    stepFour: "Отправляйтесь вместе", stepFourText: "Согласуйте детали с группой и вместе исследуйте выбранное направление.",
    safetyEyebrow: "ПЛАНИРУЙ ОСОЗНАННО", safetyTitle: "Хорошая поездка начинается с ясных договорённостей",
    safetyText: "Знакомство с попутчиками требует внимательности. Вот несколько полезных шагов до поездки.",
    safetyOneTitle: "Обсудите план заранее", safetyOneText: "Уточните даты, маршрут, примерный бюджет, транспорт и ожидания каждого участника.",
    safetyTwoTitle: "Позаботьтесь о личной безопасности", safetyTwoText: "Первую встречу назначьте в общественном месте и сообщите близкому человеку свой план.",
    safetyThreeTitle: "Не отправляйте предоплату незнакомым людям", safetyThreeText: "Joldas не принимает платежи и не подтверждает личность участников.",
    safetyNote: "В этой версии нет проверки документов, экстренной кнопки или службы наблюдения. При срочной опасности обратитесь в местные экстренные службы.",
    mapCaption: "Открытая карта · © OpenStreetMap contributors", featuresEyebrow: "ПЛАНИРУЙ ВМЕСТЕ",
    featuresTitle: "Всё для общей поездки", itineraryTitle: "Маршрут", itineraryText: "Собирайте точки и активности поездки.",
    budgetTitle: "Общий бюджет", budgetText: "Считайте ориентировочные расходы группы.",
    chatTitle: "Чат поездки", chatText: "Обсуждайте детали внутри группы.",
    createTitle: "Собери свою поездку", createText: "Опубликуй план, выбери направление и бюджет — участники смогут присоединиться.",
    accountTitle: "Профиль путешественника", accountText: "Расскажи о своих интересах, чтобы попутчикам было проще найти общий язык.",
    name: "Имя", email: "Электронная почта", password: "Пароль (не менее 10 символов)", city: "Город",
    bio: "О себе", profileInterests: "Интересы через запятую", destinations: "Куда хочешь поехать (через запятую)",
    budgetMin: "Бюджет от, ₸", budgetMax: "Бюджет до, ₸", saveProfile: "Сохранить профиль",
    switchToRegister: "Впервые здесь? Создать аккаунт", switchToLogin: "Уже есть аккаунт? Войти",
    groupTitle: "Новая групповая поездка", region: "Область или регион", description: "Описание поездки",
    start: "Начало", end: "Окончание", maxPeople: "Максимум участников", interestsTags: "Интересы через запятую",
    perPerson: "₸ / человек", group: "участников", host: "Организатор", viewTrip: "Подробнее и присоединиться",
    join: "Присоединиться к группе", joined: "Вы в группе", membersOnly: "Вступи в группу, чтобы увидеть маршрут, расходы и чат.",
    itinerary: "План поездки", activity: "Место или занятие", details: "Подробности", add: "Добавить",
    expenses: "Расходы", expense: "Название расхода", amount: "Сумма, ₸", total: "Ориентировочно всего",
    chat: "Чат группы", message: "Напиши группе…", send: "Отправить", empty: "Здесь пока пусто.",
    loading: "Загрузка…", authError: "Не удалось выполнить запрос. Попробуй ещё раз.",
    localNote: "Joldas помогает планировать вместе. Бронирование, платежи и проверка личности не входят в эту версию.",
    createdBy: "Организатор", groupCardText: "Уже собирает компанию",
  },
  kk: {
    navTrips: "Саяхат табу", navPeople: "Жолсеріктер", navMap: "Карта", navHow: "Қалай жұмыс істейді",
    signIn: "Кіру", signUp: "Тіркелу", signOut: "Шығу", heroEyebrow: "БІРГЕ САЯХАТТА · ҚАЗАҚСТАН",
    heroTitle: "Жаңа мекендер. Өз адамдарың.", heroText: "Жолсерік тауып, топ жинап, Қазақстанды бірге арала.",
    explore: "Саяхат табу", makeTrip: "Саяхат құру", searchTitle: "Қайда барамыз?",
    searchHint: "Бағыт, күн және бюджет бойынша серік тап", destination: "Бағыт", destinationPlaceholder: "Қала немесе мекен",
    dates: "Саяхат күндері", anyDates: "Кез келген күн", dateFrom: "Басталуы", dateTo: "Аяқталуы", budget: "Бір адамға бюджет", budgetPlaceholder: "Дейін, ₸",
    interests: "Қызығушылықтар", interestsPlaceholder: "Жаяу серуен, табиғат…", search: "Саяхаттарды көрсету",
    trustedNote: "Комиссиясыз және брондаусыз — тек адамдар мен жоспарлар", popular: "Неден бастаймыз?",
    communityPhotoAlt: "Жолсеріктер теңіз жағасында бірге демалып жатыр", communityCaption: "Әсерді бірге бөліскен жақсы",
    popularText: "Қазақстан бойынша келесі сапарға идеялар", allPlaces: "Барлық бағыт",
    placeAlmaty: "Алматы және таулар", placeAlmatyText: "Соқпақтар, көлдер және тау демалысы", tripFull: "Топ толық", tripOpen: "ТОП ЖИНАУДА",
    placeKolsai: "Көлсай мен Қайыңды", placeKolsaiText: "Тянь-Шаньдағы көгілдір көлдер",
    placeCharyn: "Шарын шатқалы", placeCharynText: "Шатқалға демалыс күнгі бағыт",
    placeTurkistan: "Түркістан", placeTurkistanText: "Тарих, сәулет және елдің оңтүстігі",
    placeBozzhyra: "Бозжыра үстірті", placeBozzhyraText: "Маңғыстаудың ақ жартастары мен кең даласы",
    placeBurabay: "Бурабай", placeBurabayText: "Көлдер, қарағайлы орман және Оқжетпес",
    placeAltynEmel: "Алтын-Емел", placeAltynEmelText: "Әншіқұм мен шөл даланың ерекше көрінісі",
    placeBayanaul: "Баянауыл", placeBayanaulText: "Тау көлдері мен серуен соқпақтары",
    discover: "Саяхаттарды көру", tripSection: "Ашық саяхаттар", tripSectionText: "Қауымдастық мүшелерінің нақты жоспарлары",
    noTrips: "Әзірше ашық саяхат жоқ", noTripsText: "Алғашқы саяхатты құрып, серіктеріңді тап.",
    createFirst: "Саяхат құру", companionEyebrow: "ЖАЛҒЫЗ САЯХАТТАМА", peopleTitle: "Жоспары ұқсас жолсеріктер",
    peopleText: "Сапарға кім жиналып жатқанын көріп, топқа қосыл. Қосылған соң ортақ чат ашылады.",
    seeTrip: "Саяхатты ашу", noPeople: "Ашық саяхаттар пайда болғанда жолсеріктер осында көрінеді.",
    howTitle: "Саяхат қарапайым жоспардан басталады", howText: "Идеядан ортақ чатқа дейін — қажет нәрсенің бәрі бір жерде.",
    useSearch: "Іздеуге өту", mapEyebrow: "БАҒДАР ШАҚЫРАДЫ", mapTitle: "Алматыдан Тянь-Шань көлдеріне",
    mapText: "Бағдарды ашық картадан көр. Бұл — жоспарға арналған үлгі, нақты уақыттағы навигация емес.",
    openMap: "OpenStreetMap картасын ашу", routeStart: "Алматы", routeStopOne: "Көлсай", routeStopTwo: "Қайыңды",
    audienceEyebrow: "САЯХАТҚА ДАЙЫН ЖАНДАРҒА", audienceTitle: "Жоспар әртүрлі — саяхатқа ықылас ортақ",
    audienceText: "Жаңа жер көргің келіп, бірақ таныстарыңның арасынан жолсерік табылмаса, Joldas көмектеседі.",
    audienceStudent: "Студенттерге", audienceStudentText: "Демалыс күнгі сапарға серік тауып, болжамды бюджетті алдын ала талқылау.",
    audienceYoung: "Жас мамандарға", audienceYoungText: "Жаңа топпен күнді, қызығушылықты және шағын бағдарды келісу.",
    audienceSolo: "Жеке саяхатшыларға", audienceSoloText: "Сапар жоспарын жалғыз ұйымдастырмай, оны топпен бөлісу.",
    audienceNote: "Бұл — қолданудың үлгі сценарийлері; статистика да, нақты қолданушы профильдері де емес.",
    journeyEyebrow: "БІР ОЙ — ОРТАҚ БАҒДАР", journeyTitle: "Қаладан — жаңа әсерлерге",
    journeyText: "Бағдар суреті Алматыдан Шарын арқылы көлдерге баратын сапар идеясын көрсетеді. Нүктелер мен сызық — шабыт үшін, тексерілген навигация емес.",
    journeyAlmaty: "Алматы", journeyCharyn: "Шарын", journeyKolsai: "Көлсай", journeyKaindy: "Қайыңды",
    journeyCaption: "Бағдар үлгісі · жолды, ауа райын және жергілікті ережелерді жолға шығар алдында тексеріңіз",
    stepOne: "Профиль толтыр", stepOneText: "Қызығушылығың мен бюджетіңді көрсет — басқа саяхатшылар жоспарларыңның үйлесетінін түсінсін.",
    stepTwo: "Сапар тап немесе құр", stepTwoText: "Бағыт пен күнді таңда немесе өз жоспарыңды жарияла.",
    stepThree: "Танысып, жоспарла", stepThreeText: "Топқа қосылып, содан кейін ортақ чатта бағыт пен болжамды шығынды талқыла.",
    stepFour: "Бірге жолға шық", stepFourText: "Топпен соңғы мәліметтерді келісіп, таңдаған бағытты бірге арала.",
    safetyEyebrow: "ОЙЛАНЫП ЖОСПАРЛА", safetyTitle: "Жақсы сапар нақты келісімнен басталады",
    safetyText: "Жолсеріктермен танысқанда мұқият болу маңызды. Сапарға дейін мына қадамдарды қарастыр.",
    safetyOneTitle: "Жоспарды алдын ала талқыла", safetyOneText: "Күнді, бағытты, болжамды бюджетті, көлікті және әр қатысушының күтуін нақтыла.",
    safetyTwoTitle: "Жеке қауіпсіздігіңді ойла", safetyTwoText: "Алғашқы кездесуді қоғамдық жерде өткізіп, жоспарыңды жақыныңа хабарла.",
    safetyThreeTitle: "Бейтаныс адамға алдын ала ақша жіберме", safetyThreeText: "Joldas төлем қабылдамайды және қатысушылардың жеке басын растамайды.",
    safetyNote: "Бұл нұсқада құжатты тексеру, SOS батырмасы немесе төтенше жағдайды бақылау қызметі жоқ. Шұғыл қауіп болса, жергілікті жедел қызметке хабарласыңыз.",
    mapCaption: "Ашық карта · © OpenStreetMap contributors", featuresEyebrow: "БІРГЕ ЖОСПАРЛА",
    featuresTitle: "Ортақ сапарға керектің бәрі", itineraryTitle: "Бағдар", itineraryText: "Сапар нүктелері мен әрекеттерін жина.",
    budgetTitle: "Ортақ бюджет", budgetText: "Топтың болжамды шығынын есепте.",
    chatTitle: "Сапар чаты", chatText: "Топ ішінде жоспарды талқыла.",
    createTitle: "Өз саяхатыңды жина", createText: "Жоспарды жарияла, бағыт пен бюджетті таңда — өзгелер қосыла алады.",
    accountTitle: "Саяхатшы профилі", accountText: "Қызығушылықтарыңды айт, ортақ тіл табу оңай болсын.",
    name: "Аты", email: "Электронды пошта", password: "Құпиясөз (кемі 10 таңба)", city: "Қала",
    bio: "Өзің туралы", profileInterests: "Қызығушылықтар (үтірмен)", destinations: "Барғың келетін жерлер (үтірмен)",
    budgetMin: "Бюджеттен бастап, ₸", budgetMax: "Бюджетке дейін, ₸", saveProfile: "Профильді сақтау",
    switchToRegister: "Алғаш рет пе? Тіркелу", switchToLogin: "Аккаунтың бар ма? Кіру",
    groupTitle: "Жаңа топтық саяхат", region: "Облыс немесе аймақ", description: "Саяхат сипаттамасы",
    start: "Басталуы", end: "Аяқталуы", maxPeople: "Қатысушылар саны", interestsTags: "Қызығушылықтар (үтірмен)",
    perPerson: "₸ / адам", group: "қатысушы", host: "Ұйымдастырушы", viewTrip: "Толығырақ және қосылу",
    join: "Топқа қосылу", joined: "Топ мүшесісің", membersOnly: "Бағдар, шығын және чатты көру үшін топқа қосыл.",
    itinerary: "Саяхат жоспары", activity: "Орын немесе іс-шара", details: "Мәлімет", add: "Қосу",
    expenses: "Шығындар", expense: "Шығын атауы", amount: "Сома, ₸", total: "Болжамды барлығы",
    chat: "Топ чаты", message: "Топқа жаз…", send: "Жіберу", empty: "Әзірше бос.",
    loading: "Жүктелуде…", authError: "Сұрауды орындау мүмкін болмады. Қайталап көр.",
    localNote: "Joldas бірге жоспарлауға көмектеседі. Брондау, төлем және жеке тұлғаны растау бұл нұсқаға кірмейді.",
    createdBy: "Ұйымдастырушы", groupCardText: "Топ жинап жатыр",
  },
  en: {
    navTrips: "Find a trip", navPeople: "Travel buddies", navMap: "Map", navHow: "How it works",
    signIn: "Sign in", signUp: "Create account", signOut: "Sign out", heroEyebrow: "TRAVEL TOGETHER · KAZAKHSTAN",
    heroTitle: "New places. Your people.", heroText: "Find a travel buddy, build a group, and explore Kazakhstan together.",
    explore: "Find a trip", makeTrip: "Create a trip", searchTitle: "Where to next?",
    searchHint: "Find companions by destination, dates, and budget", destination: "Destination", destinationPlaceholder: "City or place",
    dates: "Travel dates", anyDates: "Any dates", dateFrom: "From", dateTo: "To", budget: "Budget per person", budgetPlaceholder: "Up to, KZT",
    interests: "Interests", interestsPlaceholder: "Hiking, nature…", search: "Show trips",
    trustedNote: "No booking fees — just people and plans", popular: "Start exploring",
    communityPhotoAlt: "Travel buddies spending time together by the sea", communityCaption: "Good memories are better shared",
    popularText: "Ideas for your next trip in Kazakhstan", allPlaces: "All destinations",
    placeAlmaty: "Almaty & mountains", placeAlmatyText: "Trails, lakes, and mountain weekends", tripFull: "Group full", tripOpen: "OPEN GROUP",
    placeKolsai: "Kolsai & Kaindy", placeKolsaiText: "Turquoise lakes in the Tian Shan",
    placeCharyn: "Charyn Canyon", placeCharynText: "A weekend route to the canyon",
    placeTurkistan: "Turkistan", placeTurkistanText: "History, architecture, and the south",
    placeBozzhyra: "Bozzhyra Plateau", placeBozzhyraText: "White cliffs and the vast Mangystau landscape",
    placeBurabay: "Burabay", placeBurabayText: "Lakes, pine forest, and Okzhetpes Rock",
    placeAltynEmel: "Altyn-Emel", placeAltynEmelText: "Singing dunes and open steppe",
    placeBayanaul: "Bayanaul", placeBayanaulText: "Mountain lakes and walking trails",
    discover: "Explore trips", tripSection: "Open trips", tripSectionText: "Real plans from community members",
    noTrips: "No open trips yet", noTripsText: "Create the first trip and find people heading your way.",
    createFirst: "Create a trip", companionEyebrow: "DON'T TRAVEL ALONE", peopleTitle: "Travelers with similar plans",
    peopleText: "See who's planning a trip and join a group. The shared chat opens after you join.",
    seeTrip: "View trip", noPeople: "Travel buddies will appear here as trips are posted.",
    howTitle: "Every trip starts with a simple plan", howText: "From inspiration to a shared chat — the essentials in one place.",
    useSearch: "Start searching", mapEyebrow: "LET THE ROUTE INSPIRE YOU", mapTitle: "Almaty to the lakes of Tian Shan",
    mapText: "Explore a route on an open map. This is a planning reference, not turn-by-turn navigation.",
    openMap: "Open OpenStreetMap", routeStart: "Almaty", routeStopOne: "Kolsai", routeStopTwo: "Kaindy",
    audienceEyebrow: "FOR PEOPLE READY TO GO", audienceTitle: "Different plans, one shared love of travel",
    audienceText: "Joldas is for people who want to explore somewhere new but have not found a travel companion in their usual circle.",
    audienceStudent: "Students", audienceStudentText: "Find company for a weekend trip and discuss an estimated budget beforehand.",
    audienceYoung: "Young professionals", audienceYoungText: "Coordinate dates, interests, and a short itinerary with a new group.",
    audienceSolo: "Independent travelers", audienceSoloText: "Share your plans with a group instead of organizing every part alone.",
    audienceNote: "These are illustrative use cases, not market statistics or real user profiles.",
    journeyEyebrow: "ONE IDEA — A SHARED ROUTE", journeyTitle: "From the city to new experiences",
    journeyText: "This route illustration tells the story of a trip via Charyn to the lakes. Its line and stops are inspiration, not verified navigation.",
    journeyAlmaty: "Almaty", journeyCharyn: "Charyn", journeyKolsai: "Kolsai", journeyKaindy: "Kaindy",
    journeyCaption: "Illustrative route · check road conditions, weather, and local rules before travel",
    stepOne: "Set up your profile", stepOneText: "Add your interests and budget so other travelers can see whether your plans align.",
    stepTwo: "Find or create a trip", stepTwoText: "Choose a destination and dates, or publish a plan of your own.",
    stepThree: "Meet and plan together", stepThreeText: "Join a group, then discuss the route and estimated costs in its shared chat.",
    stepFour: "Set off together", stepFourText: "Confirm the details with your group and explore your chosen destination together.",
    safetyEyebrow: "PLAN WITH CARE", safetyTitle: "A good trip starts with clear expectations",
    safetyText: "Meeting new travel companions calls for care. Consider these steps before you go.",
    safetyOneTitle: "Discuss the plan in advance", safetyOneText: "Confirm dates, route, estimated budget, transport, and what each traveler expects.",
    safetyTwoTitle: "Look after your personal safety", safetyTwoText: "Choose a public place for a first meeting and share your itinerary with someone you trust.",
    safetyThreeTitle: "Do not send strangers advance payments", safetyThreeText: "Joldas does not process payments or verify travelers' identities.",
    safetyNote: "This version has no document verification, SOS button, or emergency monitoring. Contact local emergency services if you are in immediate danger.",
    mapCaption: "Open map · © OpenStreetMap contributors", featuresEyebrow: "PLAN TOGETHER",
    featuresTitle: "Everything for a shared trip", itineraryTitle: "Itinerary", itineraryText: "Collect trip stops and activities.",
    budgetTitle: "Shared budget", budgetText: "Estimate the group's expected expenses.",
    chatTitle: "Trip chat", chatText: "Coordinate the details with your group.",
    createTitle: "Build your own trip", createText: "Share your plan, destination, and budget so others can join.",
    accountTitle: "Traveler profile", accountText: "Share your interests so it's easier to find common ground.",
    name: "Name", email: "Email address", password: "Password (at least 10 characters)", city: "Home city",
    bio: "About you", profileInterests: "Interests, comma separated", destinations: "Where you'd like to go, comma separated",
    budgetMin: "Budget from, KZT", budgetMax: "Budget up to, KZT", saveProfile: "Save profile",
    switchToRegister: "New here? Create an account", switchToLogin: "Already have an account? Sign in",
    groupTitle: "Create a group trip", region: "Region", description: "About the trip",
    start: "Start", end: "End", maxPeople: "Maximum travelers", interestsTags: "Interests, comma separated",
    perPerson: "KZT / person", group: "travelers", host: "Host", viewTrip: "Details and join",
    join: "Join the group", joined: "You're in the group", membersOnly: "Join the group to see its itinerary, expenses, and chat.",
    itinerary: "Trip itinerary", activity: "Place or activity", details: "Details", add: "Add",
    expenses: "Expenses", expense: "Expense name", amount: "Amount, KZT", total: "Estimated total",
    chat: "Group chat", message: "Message your group…", send: "Send", empty: "Nothing here yet.",
    loading: "Loading…", authError: "The request failed. Please try again.",
    localNote: "Joldas helps people plan together. Booking, payments, and identity verification aren't part of this version.",
    createdBy: "Host", groupCardText: "Gathering a group",
  },
};

const places = [
  { key: "placeAlmaty", description: "placeAlmatyText", query: "Almaty", image: "/images/almaty.webp", tag: "01" },
  { key: "placeKolsai", description: "placeKolsaiText", query: "Kolsai", image: "/images/kolsai.webp", tag: "02" },
  { key: "placeCharyn", description: "placeCharynText", query: "Charyn", image: "/images/charyn.webp", tag: "03" },
  { key: "placeTurkistan", description: "placeTurkistanText", query: "Turkistan", image: "/images/turkistan.webp", tag: "04" },
  { key: "placeBozzhyra", description: "placeBozzhyraText", query: "Bozzhyra", image: "/images/hero-kazakhstan.webp", tag: "05" },
  { key: "placeBurabay", description: "placeBurabayText", query: "Burabay", image: "/images/kolsai.webp", tag: "06" },
  { key: "placeAltynEmel", description: "placeAltynEmelText", query: "Altyn-Emel", image: "/images/charyn.webp", tag: "07" },
  { key: "placeBayanaul", description: "placeBayanaulText", query: "Bayanaul", image: "/images/almaty.webp", tag: "08" },
] as const;

const dateLabel = (start: string, end: string, language: Language) =>
  `${new Date(start).toLocaleDateString(language)} – ${new Date(end).toLocaleDateString(language)}`;

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase();
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = window.localStorage.getItem("joldas-language");
    return saved === "ru" || saved === "kk" || saved === "en" ? saved : "ru";
  });
  const [trips, setTrips] = useState<Trip[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selected, setSelected] = useState<Trip | null>(null);
  const [joined, setJoined] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [filters, setFilters] = useState({ destination: "", dateFrom: "", dateTo: "", interests: "", budgetMax: "" });
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [journeyVisible, setJourneyVisible] = useState(false);
  const journeyRef = useRef<HTMLElement | null>(null);

  const t = copy[language];
  const companions = useMemo(() => {
    const seen = new Set<string>();
    return trips.filter((trip) => {
      if (seen.has(trip.hostId)) return false;
      seen.add(trip.hostId);
      return true;
    }).slice(0, 4);
  }, [trips]);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("joldas-language", language);
  }, [language]);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-travel-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    root.classList.add("travel-motion-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.travelRevealed = "true";
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    cards.forEach((card) => observer.observe(card));
    return () => { observer.disconnect(); root.classList.remove("travel-motion-ready"); };
  }, [trips]);

  useEffect(() => {
    const section = journeyRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setJourneyVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setJourneyVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const refreshTrips = async (values = filters) => {
    setTrips(await api.trips({
      ...values,
      dateFrom: values.dateFrom ? new Date(`${values.dateFrom}T00:00:00`).toISOString() : "",
      dateTo: values.dateTo ? new Date(`${values.dateTo}T23:59:59.999`).toISOString() : "",
    }));
  };
  const refreshGroup = async (tripId: string) => {
    const [plan, budget, chat] = await Promise.all([
      api.itinerary(tripId), api.expenses(tripId), api.messages(tripId),
    ]);
    setItinerary(plan);
    setExpenses(budget.items);
    setMessages(chat);
  };

  useEffect(() => {
    void refreshTrips().catch((e: unknown) => setError(e instanceof Error ? e.message : t.authError));
    if (getToken()) {
      void api.profile().then(setProfile).catch((e: unknown) => {
        setToken(null);
        setProfile(null);
        setError(e instanceof Error ? e.message : t.authError);
      });
    }
  }, []);

  useEffect(() => {
    if (!selected || !joined) return;
    const timer = window.setInterval(() => {
      void api.messages(selected.id).then(setMessages).catch((e: unknown) => {
        setError(e instanceof Error ? e.message : t.authError);
      });
    }, 8000);
    return () => window.clearInterval(timer);
  }, [selected, joined, t.authError]);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true); setError("");
    try {
      const result = registering
        ? await api.register({
          email: String(data.get("email")), password: String(data.get("password")),
          displayName: String(data.get("displayName")),
        })
        : await api.login({ email: String(data.get("email")), password: String(data.get("password")) });
      setToken(result.token);
      setProfile(await api.profile());
    } catch (e) { setError(e instanceof Error ? e.message : t.authError); }
    finally { setBusy(false); }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true); setError("");
    try {
      setProfile(await api.updateProfile({
        displayName: String(data.get("displayName")),
        homeCity: String(data.get("homeCity")),
        bio: String(data.get("bio")),
        interests: String(data.get("interests")).split(",").map((v) => v.trim()).filter(Boolean),
        preferredDestinations: String(data.get("preferredDestinations")).split(",").map((v) => v.trim()).filter(Boolean),
        budgetMin: data.get("budgetMin") ? Number(data.get("budgetMin")) : null,
        budgetMax: data.get("budgetMax") ? Number(data.get("budgetMax")) : null,
      }));
      setError("");
    } catch (e) { setError(e instanceof Error ? e.message : t.authError); }
    finally { setBusy(false); }
  }

  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true); setError("");
    try {
      await api.createTrip({
        destination: String(data.get("destination")),
        region: String(data.get("region")),
        description: String(data.get("description")),
        startsAt: new Date(String(data.get("startsAt"))).toISOString(),
        endsAt: new Date(String(data.get("endsAt"))).toISOString(),
        budgetPerPerson: Number(data.get("budgetPerPerson")),
        maxMembers: Number(data.get("maxMembers")),
        interests: String(data.get("interests")).split(",").map((v) => v.trim()).filter(Boolean),
      });
      form.reset();
      await refreshTrips();
      document.getElementById("trips")?.scrollIntoView({ behavior: "smooth" });
    } catch (e) { setError(e instanceof Error ? e.message : t.authError); }
    finally { setBusy(false); }
  }

  async function openTrip(trip: Trip) {
    setSelected(trip); setJoined(false); setError("");
    window.requestAnimationFrame(() => document.getElementById("trip-detail")?.scrollIntoView({ behavior: "smooth" }));
  }

  async function joinSelected() {
    if (!selected) return;
    if (!profile) {
      setError(t.membersOnly);
      document.getElementById("account")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setBusy(true); setError("");
    try {
      await api.joinTrip(selected.id);
      setJoined(true);
      await refreshGroup(selected.id);
      await refreshTrips();
    } catch (e) { setError(e instanceof Error ? e.message : t.authError); }
    finally { setBusy(false); }
  }

  async function addItinerary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await api.addItinerary(selected.id, { title: String(data.get("title")), details: String(data.get("details")) });
      form.reset();
      setItinerary(await api.itinerary(selected.id));
    } catch (e) { setError(e instanceof Error ? e.message : t.authError); }
  }

  async function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await api.addExpense(selected.id, { title: String(data.get("title")), amount: Number(data.get("amount")) });
      form.reset();
      setExpenses((await api.expenses(selected.id)).items);
    } catch (e) { setError(e instanceof Error ? e.message : t.authError); }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await api.sendMessage(selected.id, String(data.get("content")));
      form.reset();
      setMessages(await api.messages(selected.id));
    } catch (e) { setError(e instanceof Error ? e.message : t.authError); }
  }

  async function searchTrips(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      await refreshTrips();
      document.getElementById("trips")?.scrollIntoView({ behavior: "smooth" });
    } catch (e) { setError(e instanceof Error ? e.message : t.authError); }
    finally { setBusy(false); }
  }

  async function chooseDestination(destination: string) {
    const next = { ...filters, destination };
    setFilters(next);
    setBusy(true); setError("");
    try {
      await refreshTrips(next);
      document.getElementById("trips")?.scrollIntoView({ behavior: "smooth" });
    } catch (e) { setError(e instanceof Error ? e.message : t.authError); }
    finally { setBusy(false); }
  }

  function signOut() {
    setToken(null); setProfile(null); setJoined(false); setSelected(null);
  }

  return <main>
    <header className="topbar">
      <a className="brand" href="#" aria-label="Joldas home"><span className="brand-mark">j</span><span>joldas<span className="brand-dot">.</span></span></a>
      <nav className="nav" aria-label="Main navigation">
        <a href="#trips"><Search size={16}/><span>{t.navTrips}</span></a><a href="#people"><Users size={16}/><span>{t.navPeople}</span></a><a href="#map"><Map size={16}/><span>{t.navMap}</span></a><a href="#how"><Compass size={16}/><span>{t.navHow}</span></a>
      </nav>
      <div className="header-actions">
        <label className="language"><Globe2 size={16}/><select aria-label="Language" value={language} onChange={(e) => setLanguage(e.target.value as Language)}><option value="ru">RU</option><option value="kk">ҚАЗ</option><option value="en">EN</option></select></label>
        {profile ? <a className="login-btn" href="#account">{profile.displayName || t.accountTitle}</a> : <a className="login-btn" href="#account">{t.signIn}</a>}
        {profile && <button className="outline-btn" type="button" onClick={signOut}>{t.signOut}</button>}
      </div>
    </header>

    <section className="hero">
      <img className="hero-photo" src="/images/hero-kazakhstan.webp" alt="Mountain landscape and alpine lake" />
      <div className="hero-shade"/>
      <div className="hero-content">
        <div className="hero-kicker"><span className="live-dot"/> {t.heroEyebrow}</div>
        <h1>{t.heroTitle}</h1>
        <p>{t.heroText}</p>
        <div className="hero-actions">
          <a className="primary-btn" href="#search">{t.explore}<ArrowRight size={17}/></a>
          <a className="hero-secondary" href={profile ? "#create" : "#account"}>{t.makeTrip}<ArrowUpRight size={16}/></a>
        </div>
      </div>
      <div className="hero-location"><MapPin size={14}/><span>Almaty · Kazakhstan</span><i/></div>
      <a className="scroll-cue" href="#search" aria-label={t.searchTitle}><ArrowDown size={16}/></a>
    </section>

    {error && <div role="alert" className="app-alert">{error}<button type="button" onClick={() => setError("")} aria-label="Dismiss">×</button></div>}

    <section className="search-wrap" id="search">
      <div className="search-intro"><div className="eyebrow"><span className="eyebrow-line"/> JOLDAS DISCOVERY</div><h2>{t.searchTitle}</h2><p>{t.searchHint}</p></div>
      <form className="search-box" onSubmit={(e) => void searchTrips(e)}>
        <label className="search-field"><MapPin size={18}/><span><small>{t.destination}</small><input aria-label={t.destination} placeholder={t.destinationPlaceholder} value={filters.destination} onChange={(e) => setFilters({ ...filters, destination: e.target.value })}/></span></label>
        <label className="search-field"><CalendarDays size={18}/><span><small>{t.dateFrom}</small><input aria-label={t.dateFrom} type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}/></span></label>
        <label className="search-field"><CalendarDays size={18}/><span><small>{t.dateTo}</small><input aria-label={t.dateTo} type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}/></span></label>
        <label className="search-field"><Wallet size={18}/><span><small>{t.budget}</small><input aria-label={t.budget} type="number" min="0" placeholder={t.budgetPlaceholder} value={filters.budgetMax} onChange={(e) => setFilters({ ...filters, budgetMax: e.target.value })}/></span></label>
        <label className="search-field interest-field"><Sparkles size={18}/><span><small>{t.interests}</small><input aria-label={t.interests} placeholder={t.interestsPlaceholder} value={filters.interests} onChange={(e) => setFilters({ ...filters, interests: e.target.value })}/></span></label>
        <button className="search-submit" type="submit" disabled={busy}><Search size={17}/>{busy ? t.loading : t.search}</button>
      </form>
      <div className="search-foot"><span><ShieldCheck size={14}/>{t.trustedNote}</span><a href="#places">{t.allPlaces}<ArrowRight size={13}/></a></div>
    </section>

    <section className="places-section" id="places">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> KAZAKHSTAN · 01—08</div><h2>{t.popular}</h2><p>{t.popularText}</p></div><a className="text-link" href="#map">{t.navMap}<ArrowUpRight size={15}/></a></div>
      <div className="place-grid">
        {places.map((place) => <article className="place-card" data-travel-reveal key={place.key}>
          <img src={place.image} alt={t[place.key]} loading="lazy"/>
          <div className="place-overlay"/>
          <span className="place-number">{place.tag} / KZ</span>
          <div className="place-copy"><span>{t[place.description]}</span><h3>{t[place.key]}</h3>
            <button type="button" className="place-action" onClick={() => void chooseDestination(place.query)}>{t.discover}<ArrowRight size={15}/></button>
          </div>
        </article>)}
      </div>
    </section>

    <section className="audience-section" id="audience" aria-labelledby="audience-title">
      <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> {t.audienceEyebrow}</div><h2 id="audience-title">{t.audienceTitle}</h2><p>{t.audienceText}</p></div></div>
      <div className="audience-grid">
        <article className="audience-card"><span className="audience-icon"><Users size={20}/></span><h3>{t.audienceStudent}</h3><p>{t.audienceStudentText}</p></article>
        <article className="audience-card"><span className="audience-icon"><CalendarDays size={20}/></span><h3>{t.audienceYoung}</h3><p>{t.audienceYoungText}</p></article>
        <article className="audience-card"><span className="audience-icon"><Compass size={20}/></span><h3>{t.audienceSolo}</h3><p>{t.audienceSoloText}</p></article>
      </div>
      <p className="audience-note">{t.audienceNote}</p>
    </section>

    <section className="trips-section" id="trips">
      <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> JOLDAS COMMUNITY</div><h2>{t.tripSection}</h2><p>{t.tripSectionText}</p></div><a className="text-link" href={profile ? "#create" : "#account"}>{t.makeTrip}<ArrowUpRight size={15}/></a></div>
      <div className="trip-grid">
        {trips.map((trip) => {
          const image = trip.destination.toLowerCase().includes("charyn") ? "/images/charyn.webp"
            : trip.destination.toLowerCase().includes("turk") ? "/images/turkistan.webp"
            : trip.destination.toLowerCase().includes("kol") || trip.destination.toLowerCase().includes("кай") ? "/images/kolsai.webp" : "/images/almaty.webp";
          const full = trip.memberCount >= trip.maxMembers;
          return <article className="trip-card" data-travel-reveal key={trip.id}>
            <div className="trip-photo"><img src={image} alt={trip.destination} loading="lazy"/>
              <span className="trip-region"><MapPin size={13}/>{trip.region || trip.destination}</span>
              <span className={`trip-open${full ? " is-full" : ""}`}>{!full && <i/>}{full ? t.tripFull : t.tripOpen}</span>
            </div>
            <div className="trip-info"><div className="trip-meta"><span><CalendarDays size={14}/>{dateLabel(trip.startsAt, trip.endsAt, language)}</span></div>
              <h3>{trip.destination}</h3>
              <p className="trip-description">{trip.description || t.groupCardText}</p>
              <div className="trip-bottom"><span className="trip-tags">{trip.interests.slice(0, 3).map((tag) => <i key={tag}>{tag}</i>)}</span>
                <span className="trip-people"><Users size={15}/>{trip.memberCount}/{trip.maxMembers}</span></div>
              <div className="trip-price"><span>{trip.host?.profile?.displayName || t.host}</span><b>{trip.budgetPerPerson.toLocaleString()} {t.perPerson}</b></div>
              <button type="button" className="trip-action" onClick={() => void openTrip(trip)}>{full ? t.tripFull : t.viewTrip}<ArrowRight size={15}/></button>
            </div>
          </article>;
        })}
      </div>
      {!trips.length && <div className="empty-state"><div className="empty-icon"><Compass size={23}/></div><h3>{t.noTrips}</h3><p>{t.noTripsText}</p><a className="dark-btn" href={profile ? "#create" : "#account"}>{t.createFirst}<ArrowRight size={16}/></a></div>}
    </section>

    <section className="companions-section" id="people">
      <div className="companions-copy"><div className="eyebrow"><span className="eyebrow-line"/> {t.companionEyebrow}</div><h2>{t.peopleTitle}</h2><p>{t.peopleText}</p><a className="primary-btn dark-cta" href="#trips">{t.navTrips}<ArrowRight size={16}/></a>
        <div className="community-photo"><img src="/images/community.webp" alt={t.communityPhotoAlt} loading="lazy"/><span>{t.communityCaption}</span></div>
      </div>
      <div className="companion-list">
        {companions.length ? companions.map((trip) => {
          const name = trip.host?.profile?.displayName || t.host;
          return <article className="companion-card" key={trip.hostId}>
            <div className="person-avatar">{initials(name)}</div>
            <div className="companion-details"><span className="companion-status"><i/> {t.groupCardText}</span><h3>{name}</h3><p><MapPin size={13}/>{trip.region || "Kazakhstan"} <ArrowRight size={12}/> {trip.destination}</p></div>
            <button type="button" className="icon-action" onClick={() => void openTrip(trip)} aria-label={`${t.seeTrip}: ${name}`}><MessageCircle size={18}/></button>
          </article>;
        }) : <div className="companion-empty"><Users size={24}/><p>{t.noPeople}</p><a href={profile ? "#create" : "#account"}>{t.makeTrip}<ArrowRight size={14}/></a></div>}
      </div>
    </section>

    <section className="how-section" id="how">
      <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> SIMPLE BY DESIGN</div><h2>{t.howTitle}</h2><p>{t.howText}</p></div></div>
      <div className="steps-grid">
        <article className="step-card"><span className="step-no">01</span><div className="step-icon"><Search size={20}/></div><h3>{t.stepOne}</h3><p>{t.stepOneText}</p><a href="#search">{t.useSearch}<ArrowRight size={14}/></a></article>
        <article className="step-card"><span className="step-no">02</span><div className="step-icon"><MapPin size={20}/></div><h3>{t.stepTwo}</h3><p>{t.stepTwoText}</p><a href="#trips">{t.navTrips}<ArrowRight size={14}/></a></article>
        <article className="step-card"><span className="step-no">03</span><div className="step-icon"><MessageCircle size={20}/></div><h3>{t.stepThree}</h3><p>{t.stepThreeText}</p><a href="#map">{t.navMap}<ArrowRight size={14}/></a></article>
        <article className="step-card"><span className="step-no">04</span><div className="step-icon"><Compass size={20}/></div><h3>{t.stepFour}</h3><p>{t.stepFourText}</p><a href="#safety">{t.safetyEyebrow}<ArrowRight size={14}/></a></article>
      </div>
    </section>

    <section className="journey-section" id="journey" aria-labelledby="journey-title" ref={journeyRef}>
      <div className="journey-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> {t.journeyEyebrow}</div><h2 id="journey-title">{t.journeyTitle}</h2><p>{t.journeyText}</p></div></div>
      <div className={`journey-art${journeyVisible ? " is-active" : ""}`}>
        <img src="/images/kolsai.webp" alt="" aria-hidden="true" loading="lazy"/>
        <div className="journey-shade"/>
        <svg className="journey-path" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
          <path className="journey-path-base" d="M75 230 C190 220 205 105 345 125 S520 240 650 170 S805 90 925 65"/>
          <path className="journey-path-line" pathLength={1} d="M75 230 C190 220 205 105 345 125 S520 240 650 170 S805 90 925 65"/>
        </svg>
        <div className="journey-stop stop-almaty"><span>01</span><b>{t.journeyAlmaty}</b></div>
        <div className="journey-stop stop-charyn"><span>02</span><b>{t.journeyCharyn}</b></div>
        <div className="journey-stop stop-kolsai"><span>03</span><b>{t.journeyKolsai}</b></div>
        <div className="journey-stop stop-kaindy"><span>04</span><b>{t.journeyKaindy}</b></div>
        <p className="journey-caption">{t.journeyCaption}</p>
      </div>
    </section>

    <section className="map-section" id="map">
      <div className="map-copy"><div className="eyebrow"><span className="eyebrow-line"/> {t.mapEyebrow}</div><h2>{t.mapTitle}</h2><p>{t.mapText}</p>
        <div className="route-list"><div><span className="route-dot start-dot"/><b>{t.routeStart}</b><small>43.2383° N · 76.9455° E</small></div><i/>
          <div><span className="route-dot"/><b>{t.routeStopOne}</b><small>42.98° N · 78.32° E</small></div><i/>
          <div><span className="route-dot end-dot"/><b>{t.routeStopTwo}</b><small>43.05° N · 78.46° E</small></div></div>
        <a className="map-link" href="https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=43.2383%2C76.9455%3B43.05%2C78.46" target="_blank" rel="noreferrer">{t.openMap}<ArrowUpRight size={16}/></a>
      </div>
      <div className="map-frame">
        <iframe title={t.mapTitle} loading="lazy" referrerPolicy="no-referrer"
          src="https://www.openstreetmap.org/export/embed.html?bbox=76.65%2C42.75%2C78.8%2C43.55&layer=mapnik&marker=43.05%2C78.46"/>
        <div className="map-attribution">{t.mapCaption}</div>
      </div>
    </section>

    <section className="features-section">
      <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> {t.featuresEyebrow}</div><h2>{t.featuresTitle}</h2></div></div>
      <div className="feature-grid">
        <a href={selected ? "#trip-detail" : "#trips"} className="feature-card"><span className="feature-icon"><Compass size={21}/></span><h3>{t.itineraryTitle}</h3><p>{t.itineraryText}</p><span className="feature-go">{t.navTrips}<ArrowUpRight size={15}/></span></a>
        <a href={selected ? "#trip-detail" : "#trips"} className="feature-card"><span className="feature-icon"><Wallet size={21}/></span><h3>{t.budgetTitle}</h3><p>{t.budgetText}</p><span className="feature-go">{t.navTrips}<ArrowUpRight size={15}/></span></a>
        <a href={selected ? "#trip-detail" : "#people"} className="feature-card"><span className="feature-icon"><MessageCircle size={21}/></span><h3>{t.chatTitle}</h3><p>{t.chatText}</p><span className="feature-go">{t.navPeople}<ArrowUpRight size={15}/></span></a>
      </div>
    </section>

    <section className="safety-section" id="safety" aria-labelledby="safety-title">
      <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> {t.safetyEyebrow}</div><h2 id="safety-title">{t.safetyTitle}</h2><p>{t.safetyText}</p></div></div>
      <div className="safety-grid">
        <article className="safety-card"><span className="safety-icon"><MessageCircle size={20}/></span><h3>{t.safetyOneTitle}</h3><p>{t.safetyOneText}</p></article>
        <article className="safety-card"><span className="safety-icon"><Users size={20}/></span><h3>{t.safetyTwoTitle}</h3><p>{t.safetyTwoText}</p></article>
        <article className="safety-card"><span className="safety-icon"><ShieldCheck size={20}/></span><h3>{t.safetyThreeTitle}</h3><p>{t.safetyThreeText}</p></article>
      </div>
      <p className="safety-note"><ShieldCheck size={17}/><span>{t.safetyNote}</span></p>
    </section>

    {profile && <section className="feature-section" id="create">
      <div className="form-heading"><div className="eyebrow"><span className="eyebrow-line"/> JOLDAS COMMUNITY</div><h2>{t.createTitle}</h2><p>{t.createText}</p></div>
      <form className="feature-form" onSubmit={(e) => void createTrip(e)}>
        <label>{t.destination}<input name="destination" placeholder={t.destinationPlaceholder} required maxLength={100}/></label>
        <label>{t.region}<input name="region" maxLength={120}/></label>
        <label>{t.start}<input name="startsAt" type="datetime-local" required/></label>
        <label>{t.end}<input name="endsAt" type="datetime-local" required/></label>
        <label>{t.budget}<input name="budgetPerPerson" type="number" min="0" required/></label>
        <label>{t.maxPeople}<input name="maxMembers" type="number" min="2" max="100" defaultValue="8" required/></label>
        <label>{t.interestsTags}<input name="interests"/></label>
        <label className="wide-field">{t.description}<textarea name="description" rows={3} maxLength={2000}/></label>
        <button className="dark-btn" disabled={busy}>{busy ? t.loading : t.makeTrip}<ArrowRight size={16}/></button>
      </form>
    </section>}

    {selected && <section className="feature-section trip-detail" id="trip-detail">
      <div className="detail-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> {t.host}: {selected.host?.profile?.displayName || "—"}</div><h2>{selected.destination}</h2>
        <p>{dateLabel(selected.startsAt, selected.endsAt, language)} · {selected.budgetPerPerson.toLocaleString()} {t.perPerson}</p><p>{selected.description}</p></div>
        <button className="dark-btn" type="button" disabled={busy || joined || selected.memberCount >= selected.maxMembers} onClick={() => void joinSelected()}>{joined ? <Check size={16}/> : <Users size={16}/>} {joined ? t.joined : selected.memberCount >= selected.maxMembers ? t.tripFull : t.join}</button>
      </div>
      {!joined ? <p className="membership-note"><ShieldCheck size={18}/>{t.membersOnly}</p> : <div className="group-panels">
        <section className="group-panel"><h3><Compass size={18}/>{t.itinerary}</h3>{itinerary.map((item) => <p key={item.id}><b>{item.title}</b> {item.details}</p>)}{!itinerary.length && <p>{t.empty}</p>}
          <form className="inline-form" onSubmit={(e) => void addItinerary(e)}><input name="title" placeholder={t.activity} required maxLength={160}/><input name="details" placeholder={t.details}/><button className="dark-btn">{t.add}</button></form>
        </section>
        <section className="group-panel"><h3><Wallet size={18}/>{t.expenses}</h3>{expenses.map((item) => <p key={item.id}>{item.title}<b>{item.amount.toLocaleString()} ₸</b></p>)}<p className="group-total">{t.total}: <b>{expenses.reduce((sum, item) => sum + item.amount, 0).toLocaleString()} ₸</b></p>
          <form className="inline-form" onSubmit={(e) => void addExpense(e)}><input name="title" placeholder={t.expense} required maxLength={120}/><input name="amount" type="number" min="0" placeholder={t.amount} required/><button className="dark-btn">{t.add}</button></form>
        </section>
        <section className="group-panel chat-panel"><h3><MessageCircle size={18}/>{t.chat}</h3><div className="chat-log">{messages.map((message) => <p key={message.id}><b>{message.user.profile?.displayName || "Traveler"}:</b> {message.content}</p>)}{!messages.length && <p>{t.empty}</p>}</div>
          <form className="inline-form" onSubmit={(e) => void sendMessage(e)}><input name="content" placeholder={t.message} required maxLength={2000}/><button className="dark-btn">{t.send}</button></form>
        </section>
      </div>}
    </section>}

    <section className="account-section" id="account">
      <div className="account-intro"><div className="eyebrow"><span className="eyebrow-line"/> JOLDAS PROFILE</div><h2>{profile ? t.accountTitle : registering ? t.signUp : t.signIn}</h2><p>{t.accountText}</p>
        {profile && <button className="outline-btn" type="button" onClick={signOut}>{t.signOut}</button>}</div>
      {!profile ? <form className="feature-form auth-form" onSubmit={(e) => void submitAuth(e)}>
        {registering && <label>{t.name}<input name="displayName" required maxLength={80}/></label>}
        <label>{t.email}<input name="email" type="email" required maxLength={254}/></label>
        <label>{t.password}<input name="password" type="password" required minLength={registering ? 10 : 1} maxLength={128}/></label>
        <button className="dark-btn" disabled={busy}>{busy ? t.loading : registering ? t.signUp : t.signIn}<ArrowRight size={16}/></button>
        <button className="text-button" type="button" onClick={() => setRegistering(!registering)}>{registering ? t.switchToLogin : t.switchToRegister}</button>
      </form> : <form className="feature-form profile-form" onSubmit={(e) => void saveProfile(e)}>
        <label>{t.name}<input name="displayName" defaultValue={profile.displayName} required maxLength={80}/></label>
        <label>{t.city}<input name="homeCity" defaultValue={profile.homeCity ?? ""} maxLength={100}/></label>
        <label>{t.profileInterests}<input name="interests" defaultValue={profile.interests.join(", ")}/></label>
        <label>{t.destinations}<input name="preferredDestinations" defaultValue={profile.preferredDestinations.join(", ")}/></label>
        <label>{t.budgetMin}<input name="budgetMin" type="number" min="0" defaultValue={profile.budgetMin ?? ""}/></label>
        <label>{t.budgetMax}<input name="budgetMax" type="number" min="0" defaultValue={profile.budgetMax ?? ""}/></label>
        <label className="wide-field">{t.bio}<textarea name="bio" defaultValue={profile.bio ?? ""} rows={3} maxLength={500}/></label>
        <button className="dark-btn" disabled={busy}>{busy ? t.loading : t.saveProfile}<Check size={16}/></button>
      </form>}
    </section>

    <footer className="footer">
      <div className="footer-brand"><a className="brand" href="#"><span className="brand-mark">j</span><span>joldas<span className="brand-dot">.</span></span></a><p>{t.heroText}</p></div>
      <div className="footer-links"><a href="#trips">{t.navTrips}</a><a href="#people">{t.navPeople}</a><a href="#map">{t.navMap}</a><a href="#account">{t.accountTitle}</a></div>
      <div className="footer-note"><Sparkles size={16}/><p>{t.localNote}</p></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Joldas</span><span>{t.mapCaption}</span></div>
    </footer>
  </main>;
}
