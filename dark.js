nm.addEventListener("click", changeTheme);


//change theme from dark/light to light/dark
function changeTheme() {
    closeNav();
    if(theme.href.includes('dark')) {
        theme.href = 'style.css';
        nm.innerHTML = '<a href="#"> <i class="fa fa-moon-o fa-lg" aria-hidden="true"></i> Dark Theme</a>';
        data.dark = false;
        dataObjectUpdated();
    } else {
        theme.href = 'darkstyle.css';
        nm.innerHTML = '<a href="#"> <i class="fa fa-sun-o fa-lg" aria-hidden="true"></i> Light Theme</a>';
        data.dark = true;
        dataObjectUpdated();
    }
}

