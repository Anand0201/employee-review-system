document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('assignTaskButton').addEventListener('click', function() {
        const overlay = document.getElementById('popupOverlay');
        if (overlay.style.display === "none" || overlay.style.display === "") {
            overlay.style.display = "block";
        } else {
            overlay.style.display = "none";
        }
    });
});