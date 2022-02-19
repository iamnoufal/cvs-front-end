function reset_cert_form() {
    document.querySelectorAll(".inp-block").forEach( i => i.removeAttribute("disabled") );
    document.querySelector(".inp-block > .verify-spinner").style.visibility = "hidden";
    document.getElementById("cert-id").focus();
}

function cert_verify_success(r) {
    data = r.data.data;
    document.getElementById("cert-id-txt").innerText = data.cert_id;
    document.getElementById("cert-issue-txt").innerText = (new Date(data.cert_date)).toLocaleDateString("en-US", {day: 'numeric', month: 'short', year: 'numeric'});
    document.getElementById("cert-expire-txt").innerText = data.cert_date ? (new Date(data.cert_date)).toLocaleDateString("en-US", {day: 'numeric', month: 'short', year: 'numeric'}) : "Never";
    document.getElementById("cert-url").setAttribute('href', data.cert_url);
    animate_verify_success();
}

function cert_verify_fail(r) {
    if (!r.response) {
        show_modal("Network error", "Unable to process the request, please try again.");
    } else 
    if (r.response.status == 422) {
        error = r.response.
        data.error[0];
        show_modal("Verification failed", error.msg);
    } else 
    if (r.response.data && r.response.data.error) {
        error = r.response.data.error[0];
        show_modal("Verification failed", error.error_desc);
    } else {
        show_modal("Verification failed", "Unable to process given data, please try again.");
    }
    reset_cert_form();
}

function animate_verify_success() {
    anime({
        targets: ['.verify-form'],
        opacity: [1, 0],
        easing: 'easeInOutSine',
        autoplay: true,
        // loop: false
        duration: 500,
        complete: () => {
            document.querySelector('.right').style.width = document.querySelector('.right').offsetWidth;
            document.querySelector('.cert-data').style.display = 'block';                 
            document.querySelector('.verify-form').style.display = 'none';
            anime({
                targets: ['.verified-box'],
                easing: 'easeInOutQuad',
                opacity: [0, 1],
                autoplay: true,
                duration: 500,
                complete: () => {
                    success_anime.play()
                },
                begin: () =>  {
                    document.querySelector('.verified-box').style.display = 'flex';
                },
            });
        },
        begin: () => {
            document.querySelector('.container').style.minWidth = (document.querySelector('.container').offsetWidth + 0) + "px";
        }
    }); 
}

function show_modal(title, msg) {
    document.getElementById('error-title-txt').innerText = title;
    document.getElementById('error-body-txt').innerText = msg;
    alert_model.show();
    reset_cert_form();
}

function verify_certificate() {
    document.querySelectorAll(".inp-block").forEach( i => i.setAttribute("disabled", 1) );
    document.querySelector(".inp-block > .verify-spinner").style.visibility = "visible";
    cert_id = document.getElementById("cert-id").value.trim();
    grecaptcha.ready(() => {
        grecaptcha.execute('6Lf9Uw4eAAAAANq0h_FEmIV7ogYlvGn7WMJsGKsA', {action: 'submit'}).then((token) => {
            axios.get(IITM_BSC_API + 'verify/' + cert_id, {
                params: {
                    recaptcha: token    
                },
            }).then(
                cert_verify_success
            ).catch(
                cert_verify_fail
            );
        });
    });
}

var alert_model = new bootstrap.Modal(document.getElementById('alert-modal'));
var path = window.location.pathname.split("/")[1];
var IITM_BSC_API = "https://api.iitmbsc.org/v1/";
var success_anime = anime.timeline({
    autoplay: false, 
    direction: 'normal', 
    complete: () => {
        anime({
            targets: ['.cert-data'],
            easing: 'easeInOutQuad',
            translateX: ['0', '15'],
            opacity: ['0', '1'],
            autoplay: true,
            duration: 500,
        });
    }
}).add({
    targets: '.checkmark',
    scale: [{
        value: [0, 1],
        duration: 600,
        easing: 'easeOutQuad'
    }]
}).add({
    targets: '.check',
    strokeDashoffset: {
        value: [anime.setDashoffset, 0],
        duration: 700,
        delay: 200,
        easing: 'easeOutQuart'
    }
})

if (path) {
    document.getElementById("cert-id").value = path;
}
