// features/names/names.js - Ù…Ù†Ø·Ù‚ ÙˆØ¨Ø±Ù…Ø¬Ø© ØµÙØ­Ø© names.html
const slides = document.querySelectorAll('.carousel-slide');
    let cur = 0;
    setInterval(() => { slides[cur].classList.remove('active'); cur = (cur+1)%slides.length; slides[cur].classList.add('active'); }, 8000);

    document.addEventListener("DOMContentLoaded", () => {
        fetch('names.json')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    renderNames(data);
                }
            })
            .catch(err => {
                console.error("Error loading names.json:", err);
                // Fallback to axios if fetch failed
                if (typeof axios !== 'undefined') {
                    axios.get('names.json')
                        .then(res => renderNames(res.data))
                        .catch(() => {
                            document.getElementById('names-tbody').innerHTML = '<tr><td colspan="3" style="text-align:center; padding:30px; color:#e74c3c;">حدث خطأ في جلب البيانات. يرجى المحاولة لاحقاً.</td></tr>';
                        });
                } else {
                    document.getElementById('names-tbody').innerHTML = '<tr><td colspan="3" style="text-align:center; padding:30px; color:#e74c3c;">حدث خطأ في جلب البيانات. يرجى المحاولة لاحقاً.</td></tr>';
                }
            });
    });

    function renderNames(namesArray) {
        const tbody = document.getElementById('names-tbody');
        let html = '';
        namesArray.forEach(item => {
            html += `
                <tr>
                    <td class="td-number">${item.id}</td>
                    <td class="td-name">${item.name}</td>
                    <td class="td-meaning">${item.text}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }
