document.addEventListener("DOMContentLoaded", () => {
    // --- Image Comparison Slider (Slide 1) ---
    const slider = document.getElementById("compareSlider");
    const foregroundImg = document.querySelector(".img-foreground");
    const sliderLine = document.querySelector(".slider-line");

    if (slider && foregroundImg && sliderLine) {
        const updateSlider = (val) => {
            foregroundImg.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
            sliderLine.style.left = `${val}%`;
        };

        slider.addEventListener("input", (e) => {
            updateSlider(e.target.value);
        });
        
        // Remove bouncy animation on interaction
        const stopAnimation = () => slider.classList.remove("needs-interaction");
        slider.addEventListener("mousedown", stopAnimation, { once: true });
        slider.addEventListener("touchstart", stopAnimation, { once: true });

        // Set initial state
        updateSlider(slider.value);
    }

    // --- Slide Navigation Deck ---
    const slides = document.querySelectorAll(".main-screen");
    const prevBtn = document.getElementById("navPrev");
    const nextBtn = document.getElementById("navNext");
    const slideCounter = document.getElementById("slideCounter");
    let currentSlide = 0;

    function updateNav() {
        if (prevBtn) prevBtn.disabled = currentSlide === 0;
        if (nextBtn) nextBtn.disabled = currentSlide === slides.length - 1;
        
        if (slideCounter) {
            const pad = (n) => String(n).padStart(2, "0");
            slideCounter.textContent = `${pad(currentSlide + 1)} / ${pad(slides.length)}`;
        }
    }

    function goToSlide(index) {
        if (index < 0 || index >= slides.length || index === currentSlide) return;
        
        const previousIndex = currentSlide;
        const goingForward = index > previousIndex;
        
        // Remove classes
        slides[previousIndex].classList.remove("active");
        if (goingForward) {
            slides[previousIndex].classList.add("prev-slide");
        } else {
            slides[previousIndex].classList.remove("prev-slide");
        }

        currentSlide = index;
        slides[currentSlide].classList.remove("prev-slide");
        slides[currentSlide].classList.add("active");
        slides[currentSlide].scrollTop = 0;
        
        updateNav();
    }

    // Initialize first slide
    if (slides.length > 0) {
        slides.forEach((s, idx) => {
            if (idx === 0) {
                s.classList.add("active");
            } else {
                s.classList.remove("active", "prev-slide");
            }
        });
        updateNav();
    }

    // Button clicks
    if (prevBtn) prevBtn.addEventListener("click", () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => goToSlide(currentSlide + 1));

    // Keyboard navigation (Arrow keys and Spacebar)
    document.addEventListener("keydown", (e) => {
        // Ignore if user is interacting with the range slider thumb
        if ((e.target === slider || e.target.classList.contains('days-slider')) && (e.key === "ArrowLeft" || e.key === "ArrowRight")) return;

        if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
            if (currentSlide < slides.length - 1) {
                e.preventDefault();
                goToSlide(currentSlide + 1);
            }
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
            if (currentSlide > 0) {
                e.preventDefault();
                goToSlide(currentSlide - 1);
            }
        }
    });

    // --- Bio-Impedance Science Slider (Slide 5) ---
    const daysSlider = document.getElementById("daysSlider");
    const dayCounter = document.getElementById("dayCounter");
    const dayStatus = document.getElementById("dayStatus");
    
    const btnHighFreq = document.getElementById("btnHighFreq");
    const btnLowFreq = document.getElementById("btnLowFreq");
    
    const pathHighFreq = document.getElementById("pathHighFreq");
    const pathLowFreqIntact = document.getElementById("pathLowFreqIntact");
    const pathLowFreqDegraded = document.getElementById("pathLowFreqDegraded");
    const cellsIntact = document.getElementById("cellsIntact");
    const cellsDegraded = document.getElementById("cellsDegraded");
    
    const legendColorLine = document.getElementById("legendColorLine");
    const legendText = document.getElementById("legendText");
    
    let isHighFreq = true;

    function updateScienceView() {
        if (!daysSlider) return;
        const days = parseInt(daysSlider.value);
        dayCounter.textContent = days;
        const progress = (days - 1) / 13;
        
        // Update day text
        if (days <= 4) {
            dayStatus.textContent = "(Fresh & Intact)";
        } else if (days <= 9) {
            dayStatus.textContent = "(Beginning to degrade)";
        } else {
            dayStatus.textContent = "(Cell membrane completely broken down)";
        }
        
        // Cell degradation visual (Solid -> Dashed -> Invisible)
        let intactOpacity = 1;
        let degradedOpacity = 0;
        
        if (progress <= 0.5) {
            // Days 1 to 7: Solid fades out, Dashed fades in
            const p = progress * 2;
            intactOpacity = 1 - p;
            degradedOpacity = p;
        } else {
            // Days 7 to 14: Solid is gone, Dashed fades out to 0
            const p = (progress - 0.5) * 2;
            intactOpacity = 0;
            degradedOpacity = 1 - p;
        }
        
        if (cellsIntact) cellsIntact.style.opacity = intactOpacity;
        if (cellsDegraded) cellsDegraded.style.opacity = degradedOpacity;
        
        // Paths & Legend based on Toggle
        if (isHighFreq) {
            if (btnHighFreq) btnHighFreq.classList.add("active");
            if (btnLowFreq) btnLowFreq.classList.remove("active");
            
            if (pathHighFreq) pathHighFreq.style.opacity = 1;
            if (pathLowFreqIntact) pathLowFreqIntact.style.opacity = 0;
            if (pathLowFreqDegraded) pathLowFreqDegraded.style.opacity = 0;
            
            if (legendColorLine) legendColorLine.style.background = "repeating-linear-gradient(90deg, #EA580C, #EA580C 6px, transparent 6px, transparent 10px)";
            if (legendText) legendText.textContent = "High frequency current easily passes straight through cellular walls";
        } else {
            if (btnHighFreq) btnHighFreq.classList.remove("active");
            if (btnLowFreq) btnLowFreq.classList.add("active");
            
            if (pathHighFreq) pathHighFreq.style.opacity = 0;
            if (pathLowFreqIntact) pathLowFreqIntact.style.opacity = Math.max(0, 1 - (progress * 1.5));
            if (pathLowFreqDegraded) pathLowFreqDegraded.style.opacity = progress;
            
            if (legendColorLine) legendColorLine.style.background = "repeating-linear-gradient(90deg, #71717A, #71717A 8px, transparent 8px, transparent 14px)";
            
            if (legendText) {
                if (days <= 4) {
                    legendText.textContent = "Low freq current struggles around intact cells";
                } else if (days <= 9) {
                    legendText.textContent = "Low freq current passes through weakened membrane";
                } else {
                    legendText.textContent = "Low freq current passes straight through degraded cells";
                }
            }
        }
    }

    if (daysSlider) {
        daysSlider.addEventListener("input", updateScienceView);
    }
    
    if (btnHighFreq) {
        btnHighFreq.addEventListener("click", () => {
            isHighFreq = true;
            updateScienceView();
        });
    }
    
    if (btnLowFreq) {
        btnLowFreq.addEventListener("click", () => {
            isHighFreq = false;
            updateScienceView();
        });
    }
    
    // Initialize view
    updateScienceView();

    // --- Accordions (Slide 6) ---
    const accordionHeaders = document.querySelectorAll(".accordion-header");
    
    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            const isActive = item.classList.contains("active");
            
            // Close all items
            document.querySelectorAll(".accordion-item").forEach(accItem => {
                accItem.classList.remove("active");
            });
            
            // Open this item if it wasn't active
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });
});
