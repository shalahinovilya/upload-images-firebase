export function uploadImg ({onUpload}) {

    const inputFiles = document.querySelector('#selectFiles')
    const imagesBlock = document.querySelector('.card__images-block')
    const uploadBtn = document.querySelector('.upload-files')
    uploadBtn.style.display = 'none'
    const openBtn = document.querySelector('.open-files')

    let allImages = {}

    const changeHandler = (e) => {

        const newImages = Array.from(e.target.files)

        if (!newImages.length) return;

        newImages.forEach(element => {

            const id = makeid()

            allImages[id] = element

            const reader = new FileReader()

            reader.onload = e => {

                const result = e.target.result

                const html = `
                <div class="images-block__image-container image-container">
                    <div data-id=${id} class="image-container__remove-img">&times</div>
                    <img src="${result}" alt="File was not found">
                    <div class="image-container__info-bar info-bar"><span>${formatBytes(element.size)}</span></div>
                </div>
            `

                imagesBlock.insertAdjacentHTML('beforeend', html)
            }

            reader.readAsDataURL(element)

        })
        uploadBtn.style.display = 'inline'
    }

    const removeHandler = (e) => {

        if (!e.target.dataset.id) return;

        for (let key of Object.keys(allImages)) {
            if (key === e.target.dataset.id) delete allImages[key]
        }

        const imgContainer = e.target.closest('.images-block__image-container')
        imgContainer.classList.add('remove')

        const transitionBlock = () => {
            e.target.closest('.image-container').remove()

            if (!Object.keys(allImages).length) uploadBtn.style.display = 'none'
            imgContainer.removeEventListener('transitionend', transitionBlock)
        }

        imgContainer.addEventListener('transitionend', transitionBlock)
    }

    const clearInfoBarBlock = (el) => {
        el.style.bottom = '4px'
        el.innerHTML = '<div class="info-bar__progress-bar progress-bar"></div>'
    }

    openBtn.addEventListener('click', () => {
        inputFiles.click()
    })

    inputFiles.addEventListener('change', changeHandler)

    imagesBlock.addEventListener('click', removeHandler)

    uploadBtn.addEventListener('click', () => {
        const removeImgList = document.querySelectorAll('.image-container__remove-img')
        removeImgList.forEach(e => e.remove())

        const imgInfoBarList = document.querySelectorAll('.image-container__info-bar')
        imgInfoBarList.forEach(clearInfoBarBlock)

        onUpload(allImages, imgInfoBarList)

    })
}

function makeid() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
