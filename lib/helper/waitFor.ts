
export function waitFor(ms:number){
    return new Promise ((resolve)=>setTimeout(resolve,ms))
}
///Hàm waitFor sẽ trả về một Promise, hoàn thành sau ms mili giây.