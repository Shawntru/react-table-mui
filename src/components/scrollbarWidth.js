const scrollbarWidth = () => {
    // thanks to https://davidwalsh.name/detect-scrollbar-width
    // Used in determining the width of scrollbar for accurate display of virtualized table rows
    const scrollDiv = document.createElement('div')
    scrollDiv.setAttribute('style', 'width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;')
    document.body.appendChild(scrollDiv)
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    document.body.removeChild(scrollDiv)
    return scrollbarWidth
}

export default scrollbarWidth