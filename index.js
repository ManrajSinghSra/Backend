function set(time,mess){
    const start=new Date()//=>1

    while(1){
        let tme=new Date()//=>1  2  3
        if(tme.getTime()-start.getTime()==time){
            break
        }
    }
    console.log(mess);
 
}

set(3000,"ello")