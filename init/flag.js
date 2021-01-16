class Flag {
    constructor(){
        this.storage = {
            help : {
                value : '',
                description : 'command that help'
            }
        }
    }
    add = (name, value, description) => {
        this.storage[name] = {value, description}
        return this.storage[name]
    }

    complete = () => {
        const allCommands = process.argv

        for(let i = 2; i < allCommands.length; i++){
            let clearCommandName = allCommands[i];
            let isCommand = false;
            for(let i = 0; i < 2; i++){
                if(clearCommandName[0] === '-') {
                    isCommand = true;
                    clearCommandName = clearCommandName.substr(1)
                }
            }
            if(clearCommandName === 'help' && isCommand){
                console.log('It is help command. (index) it is a command without - or --');
                console.table(this.storage)
            }
            
            
            if(this.storage[clearCommandName] && isCommand){
                let parametr = this.storage[clearCommandName].value
                if (allCommands[i+1] && allCommands[i+1][0] !== '-') {
                    parametr = allCommands[i+1]
                    i++
                }
                this.storage[clearCommandName].value = parametr
            }
        }
    }
}

module.exports = Flag