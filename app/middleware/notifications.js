class MessageObserver {
    constructor() {
        this.message = ''
        this.observers = new Set()
    }

    addObserver(observer){
        this.observers.add(observer)
    }

    setMessage(message) {
        this.message = message
        this.notifyObserver()
    }

    notifyObserver(){
        this.observers.forEach(observer => observer.update(this.message))
    }
}

class MessageDisplay {
    constructor(elementId) {
        this.element = document.getElementById(elementId)
    }

    update(message){
        this.element.innerHTML = message
    }
}

const messageObserver = new MessageObserver()
const messageDisplay = new MessageDisplay()

messageObserver.addObserver(messageDisplay)

messageObserver.setMessage('Bonjour !')