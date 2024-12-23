import bcrypt from 'bcryptjs'; // Ensure bcryptjs is installed
import { createClient } from '@supabase/supabase-js'; // Ensure @supabase/supabase-js is installed

document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript is loaded!');

    // Language selector functionality
    const englishBtn = document.getElementById("english-btn");
    const frenchBtn = document.getElementById("french-btn");

    if (englishBtn && frenchBtn) {
        const handleLanguageSelection = (selectedBtn, otherBtn) => {
            selectedBtn.classList.add("lang-btn-active");
            otherBtn.classList.remove("lang-btn-active");

            // Temporary feedback for selection
            if (!selectedBtn.textContent.includes("Selected")) {
                selectedBtn.textContent += " Selected";
                setTimeout(() => {
                    selectedBtn.textContent = selectedBtn.textContent.replace(" Selected", "");
                }, 2000);
            }
        };

        // Add event listeners to buttons
        englishBtn.addEventListener("click", () => handleLanguageSelection(englishBtn, frenchBtn));
        frenchBtn.addEventListener("click", () => handleLanguageSelection(frenchBtn, englishBtn));
    }

    // Show/hide login container on scroll
    const loginContainer = document.querySelector(".login-container");
    const statisticsContainer = document.querySelector(".header-container");

    if (loginContainer && statisticsContainer) {
        loginContainer.style.display = "none";

        const handleScroll = () => {
            const statisticsRect = statisticsContainer.getBoundingClientRect();
            const isInView = statisticsRect.top <= window.innerHeight && statisticsRect.bottom >= 0;

            loginContainer.style.display = isInView ? "flex" : "none";
        };

        let scrollTimeout;
        window.addEventListener("scroll", () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScroll, 100);
        });

        // Initial check in case the user starts mid-page
        handleScroll();
    }

    // Background image carousel
    const images = [
        'images/house1.jpg',
        'images/house2.jpg',
        'images/house3.jpg'
    ];
    const headerContainer = document.getElementById('header-container');

    if (headerContainer) {
        let currentIndex = 0;

        const changeBackgroundImage = () => {
            currentIndex = (currentIndex + 1) % images.length;
            headerContainer.style.backgroundImage = `url(${images[currentIndex]})`;
        };

        setInterval(changeBackgroundImage, 12000);
    }

    // Phone number validation
    const phoneNumberInput = document.getElementById("phone-number");
    if (phoneNumberInput) {
        phoneNumberInput.addEventListener('input', () => {
            phoneNumberInput.value = phoneNumberInput.value.replace(/[^0-9()+\-\s]/g, '');
        });
    }
});

// Show/hide login prompt
function showLoginPrompt() {
    document.getElementById('login-prompt').style.display = 'block';
}

function closePrompt() {
    document.getElementById('login-prompt').style.display = 'none';
}
// Supabase initialization

const supabaseUrl = 'https://adpzhrnvewzlurhstbmx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkcHpocm52ZXd6bHVyaHN0Ym14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4MTgxNzYsImV4cCI6MjA1MDM5NDE3Nn0.kFjwuCkaO4_jA6sxQKZ6W9ro6zBW4G0JthK-_I0VeXM';
const { data, error } = await supabase.from('users').insert([{ firstname, lastname, occupation, location, email, password: hashedPassword }]);
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

// Register a new user
async function register() {
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const occupation = document.getElementById('occupation').value;
    const location = document.getElementById('location').value;
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const hashedPassword = bcrypt.hashSync(password, 10);

    const { data, error } = await supabase
        .from('users')
        .insert([{ firstname, lastname, occupation, location, email, password: hashedPassword }]);

    document.getElementById('output').textContent = error ? `Error: ${error.message}` : 'Registration successful!';
}

// Log in an existing user
async function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const { data, error } = await supabase
            .from('users')
            .select('email, password')
            .eq('email', email)
            .single();

        if (error || !data) {
            document.getElementById('output').textContent = 'Incorrect email or password!';
            window.location.href = 'notwelcome.html';
            return;
        }

        if (bcrypt.compareSync(password, data.password)) {
            document.getElementById('output').textContent = 'Login successful!';
            window.location.href = 'welcome.html';
        } else {
            document.getElementById('output').textContent = 'Incorrect email or password!';
            window.location.href = 'notwelcome.html';
        }
    } catch (err) {
        console.error('Error during login:', err);
        document.getElementById('output').textContent = 'An unexpected error occurred!';
        window.location.href = 'notwelcome.html';
    }
}

// Fetch and display users
async function fetchUsers() {
    try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) {
            console.error('Error fetching data:', error);
            return;
        }

        const tableBody = document.querySelector('#user-table tbody');
        tableBody.innerHTML = '';
        data.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.firstname || 'N/A'}</td>
                <td>${user.lastname}</td>
                <td>${user.occupation}</td>
                <td>${user.location}</td>
                <td>${user.email}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

// Fetch and display users on page load
document.addEventListener('DOMContentLoaded', fetchUsers);
