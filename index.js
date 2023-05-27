const Eris = require("eris");
const fs = require("fs");
const token = require("./config").token;
const lolo = new Eris("Bot "+token, {
		intents: ["guildMessages", "guildMembers"],
        maxShards: "auto"
});
        lolo.commands = new Eris.Collection();
        lolo.components = new Eris.Collection();

        // Events
lolo.on("ready", () => {
    	for(let cmdFile of fs.readdirSync("./commands/").filter(q => q.endsWith(".js"))) {
          const File = require("./commands/"+cmdFile);
            lolo.commands.set(File.options.name, File);
             lolo.createCommand(File.options)
            }
         console.log("logged");
     });

    lolo.on("interactionCreate", async i =>{
        try {
       if(i.member.user.bot) return;
       if(!lolo.getCommand(i.id) === lolo.commands.get(i.data.name)) {
        lolo.deleteCommand(i.id);
       }
       if(i.data.name) {
        if(!i.data.options) {
        const Command = require("./commands/"+i.data.name);
        await Command.run(lolo, i, i.data);
    }
        if(i.data.options && i.data.options[0].value) {
        const Option = require("./options/"+i.data.name+"/"+i.data.options[0].name)
        await Option.run(lolo, i, i.data.options[0])
    }
       }
       if(i.data.options && i.data.options[0].type === 1 && i.data.options[0].name) {
        const Subcommand = require("./subcommands/"+i.data.options[0].name);
        await Subcommand.run(lolo, i, i.data.options[0]);
       }
   } catch(err) {
    console.error(err);
    return i.createMessage({ content: "error culo: ```js\n"+err+"```" });
   }
});

lolo.connect();