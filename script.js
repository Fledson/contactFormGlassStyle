const Utils = {
    maskPhone(e){
      var valor = document.getElementById("phone").attributes[0].ownerElement['value'];
      var retorno = valor.replace(/\D/g, "");
      retorno = retorno.replace(/^0/, "");
      if (retorno.length > 10) {
        retorno = retorno.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
      } else if (retorno.length > 5) {
        if (retorno.length == 6 && e.code == "Backspace") { 
          // necessário pois senão o "-" fica sempre voltando ao dar backspace
          return; 
        } 
        retorno = retorno.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
      } else if (retorno.length > 2) {
        retorno = retorno.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
      } else {
        if (retorno.length != 0) {
          retorno = retorno.replace(/^(\d*)/, "($1");
        }
      }
      document.getElementById("phone").attributes[0].ownerElement['value'] = retorno;
    },
    validEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

}
const Form = {
  getValues() {
    return {
      name: document.querySelector('input#name').value,
      company: document.querySelector('input#company').value,
      email: document.querySelector('input#email').value,
      phone: document.querySelector('input#phone').value,
      message: document.querySelector('textarea#message').value
    }
  },
  validate() {
    const {name, company, email, phone, message} = Form.getValues()

    if(name.trim() === '' || company.trim() === '' || email.trim() === '' || phone.trim() === '' || message.trim() === '') {
      throw new Error('Existem campos vazios, preencha todos os campos')
    }
    if (!Utils.validEmail(email)){
      throw new Error(`O valor ${email} preenchido no campo e-mail é invalido`)
    }
  },
  env() {
    const {name, company, email, phone, message} = Form.getValues()
     
    fetch("https://formsubmit.co/ajax/fledsonhenrique@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            Cliente: name,
            Email: email,
            Empresa: company,
            Mensagem: `o cliente ${name} da empresa ${company}, entrou em contato com a seguinte mensagem:
            "${message}"
            entre em contato com ele pelo telefone: ${phone} ou email: ${email}`
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));

    Swal.fire({
      icon: 'success',
      title: 'Show de Bola!!!!!',
      text: `${name}, Já recebemos sua mensagem e entraremos em contato em breve`,
      footer: '<a href="https://youtu.be/NVc_xY_dP-M">Veja aqui aonde aprendi o envio de email!</a>'
    })
    
  },
  clearForm(){
    document.querySelector('form').reset()
  },
  submit(event) {
    event.preventDefault()
    
    try {
      
      Form.getValues()
      Form.validate()
      Form.env()
      Form.clearForm()
              
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'ops!',
        text: `${error.message}`
      })
    }
  }
}