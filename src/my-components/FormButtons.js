// FormButtons.js: SUBMIT, RESET and FAQ buttons at the bottom of the booking form.
// SUBMIT and RESET are handled by the parent <form> (see Home.js).
function FormButtons() {
  // FAQ opens in a separate browser window so the form is not lost.
  // The "#/faq" part works with HashRouter, also when hosted on GitHub Pages.
  const openFaq = () => {
    const url = `${window.location.origin}${window.location.pathname}#/faq`;
    window.open(url, '_blank', 'width=1000,height=800');
  };

  return (<>
    <input type="submit" className="btn me-3 text-dark bg-white" style={{ width: '5em' }} value="SUBMIT" />
    <input type="reset" className="btn me-3 text-dark bg-white" style={{ width: '5em' }} value="RESET" />
    <input type="button" className="btn me-3 text-dark bg-white" style={{ width: '5em' }} value="FAQ" onClick={openFaq} />
  </>);
}

export default FormButtons;