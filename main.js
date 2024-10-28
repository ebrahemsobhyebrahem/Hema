

// الحصول على العناصر المطلوبة من الـ DOM
const typing_form = document.querySelector(".typing_form");
const chat_list = document.querySelector(".chat_list");

// تعريف مفاتيح API و URL الخاص بالطلب
const API_Key = "AIzaSyB-_SpF5-yAFq0FAIMNtikXC3d1PI2frXM";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_Key}`;

// تعريف متغير userMessage
let userMessage;

// تحميل الأصوات المتاحة عند تحميل الصفحة
let voices = [];
const loadVoices = () => {
    voices = speechSynthesis.getVoices();
    if (!voices.length) {
        console.error("No voices found. Please check your browser settings.");
    } else {
        console.log("Voices loaded:", voices);
    }
};

// تأكد من تحميل الأصوات بشكل كامل
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
}

// دالة إظهار تأثير الكتابة
const showTypingEffect = (text, textElement) => {
    const words = text.split(" ");
    let currenWordIndex = 0;

    const typingInterval = setInterval(() => {
        textElement.innerText += (currenWordIndex === 0 ? "" : " ") + words[currenWordIndex++];
        if (currenWordIndex === words.length) {
            clearInterval(typingInterval);
        }
        window.scrollTo(0, chat_list.scrollHeight);
    }, 75);
}

// دالة نسخ الرسالة إلى الحافظة
const copyMessage = (copy_Btn) => {
    const messageText = copy_Btn.closest(".message").querySelector(".text").innerText;
    navigator.clipboard.writeText(messageText);
    copy_Btn.innerText = "done";

    setTimeout(() => copy_Btn.innerText = "content_copy", 1000);
}

// دالة إعادة تحميل الرسالة (مسح الرسالة القديمة وجلب جديدة)
const reloadMessage = async (reload_Btn) => {
    const messageDiv = reload_Btn.closest(".message");
    const textElement = messageDiv.querySelector(".text");

    textElement.innerText = ""; // مسح النص القديم
    messageDiv.classList.add("loading"); // إضافة حالة التحميل

    // طلب API جديد للحصول على الرد
    await generateAPIResponse(messageDiv);
}

// دالة قراءة الرسالة بصوت عالٍ
const readMessageAloud = (read_Btn) => {
    const messageText = read_Btn.closest(".message").querySelector(".text").innerText;
    const utterance = new SpeechSynthesisUtterance(messageText);

    // تحديد اللغة بناءً على النص
    if (/[\u0600-\u06FF]/.test(messageText)) {
        // النص يحتوي على حروف عربية
        utterance.lang = 'ar'; // اللغة العربية
    } else {
        // النص باللغة الإنجليزية
        utterance.lang = 'en'; // اللغة الإنجليزية
    }

    utterance.rate = 0.9; // سرعة التحدث
    utterance.volume = 1; // مستوى الصوت
    utterance.pitch = 1; // نغمة الصوت

    // التحقق من تحميل الأصوات قبل القراءة
    if (!voices.length) {
        loadVoices();  // محاولة تحميل الأصوات
        if (!voices.length) {
            console.error("No voices available to use.");
            return;  // إنهاء إذا لم يتم العثور على أي أصوات
        }
    }

    // اختيار صوت رجل مناسب بناءً على اللغة
    const selectedVoice = voices.find(voice =>
        (utterance.lang === 'ar' && voice.lang === 'ar-SA' && voice.name.includes("Male")) ||
        (utterance.lang === 'en' && voice.lang === 'en-US' && voice.name.includes("Male"))
    );

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    // تشغيل القراءة الصوتية
    speechSynthesis.speak(utterance);
}

// دالة إظهار الرسالة أثناء التحميل
const showLoading = () => {
    const html = `
    <div class="message">
        <div class="message_content">
            <img src="Hema2.png" alt="">
            <p class="text"></p>
            <div class="loading_indicoator">
                <div class="loading_Bar"></div>
                <div class="loading_Bar"></div>
                <div class="loading_Bar"></div>
            </div>
        </div>
        <div class="message_icons">
            <span onClick="copyMessage(this)" class="material-symbols-outlined">
                content_copy
            </span>
            <span onClick="reloadMessage(this)" class="material-symbols-outlined">
                refresh
            </span>
            <span onClick="readMessageAloud(this)" class="material-symbols-outlined">
                volume_up
            </span>
        </div>
    </div>
    `;

    const div = document.createElement("div");
    div.classList.add("message", "incoming", "loading");
    div.innerHTML = html;
    chat_list.appendChild(div);

    return div;
}

// دالة توليد الرد عبر API
const generateAPIResponse = async (div) => {
    const textElement = div.querySelector(".text");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: userMessage }]
                }]
            })
        });

        const data = await response.json();

        if (!data || !data.candidates || !data.candidates[0].content) {
            console.error("No content found in API response");
            return;
        }

        const apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
        console.log(apiResponse);

        if (apiResponse === "أنا نموذج لغوي كبير، تم تدريبي بواسطة جوجل.") {
            const customResponse1 = "أنا مساعد الشخصي وتم تصميمي بواسطة إبراهيم صبحي";
            showTypingEffect(customResponse1, textElement);
        } else if (apiResponse === "I am Gemini, a multi-modal AI model, developed by Google. I am designed to provide information and answer questions to the best of my abilities.") {
            const customResponse2 = "I am an artificial intelligence model developed by Ibrahim Sobhi to provide intelligent assistance and accurate answers in various fields. My mission is to help you get the information and answers you need in a fast and easy way.";
            showTypingEffect(customResponse2, textElement);
        } else {
            showTypingEffect(apiResponse, textElement);
        }

    } catch (error) {
        console.error("Error fetching API response:", error);
    } finally {
        div.classList.remove("loading");
    }
}

// دالة التعامل مع الرسائل الصادرة
const handleOutGoingChat = () => {
    userMessage = document.querySelector(".typing_input").value;

    if (!userMessage) return;

    const html = `
    <div class="message_content">
        <img src="ChatHema1.png" alt="">
        <p class="text"></p>
    </div>
    `;

    const div = document.createElement("div");
    div.classList.add("message", "outgoing");
    div.innerHTML = html;
    div.querySelector(".text").innerHTML = userMessage;
    chat_list.appendChild(div);

    typing_form.reset();
    window.scrollTo(0, chat_list.scrollHeight);

    const loadingDiv = showLoading();

    if (userMessage.includes("عمرو سلامة")) {
        setTimeout(() => {
            const customResponse = "الأستاذ عمرو سلامة يدرس فيزياء";
            const textElement = loadingDiv.querySelector(".text");
            showTypingEffect(customResponse, textElement);
            loadingDiv.classList.remove("loading");
        }, 75);
    } else {
        setTimeout(() => generateAPIResponse(loadingDiv), 500);
    }
}

// إضافة حدث الإرسال للنموذج
typing_form.onsubmit = (e) => {
    e.preventDefault();
    handleOutGoingChat();
}
