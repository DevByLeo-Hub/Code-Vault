document.addEventListener("DOMContentLoaded", () => {
    const room = document.getElementById("room");
    const cord = document.getElementById("cord");
    
    const emotions = [
        "off", 
        "joy", 
        "anger", 
        "disgust", 
        "sadness", 
        "anxiety", 
        "inlove", 
        "crying", 
        "naughty", 
        "clown"
    ];
    
    let currentEmotionIndex = 0;

    cord.addEventListener("click", () => {
        currentEmotionIndex = (currentEmotionIndex + 1) % emotions.length;
        const newEmotion = emotions[currentEmotionIndex];
        room.setAttribute("data-emotion", newEmotion);
    });
});