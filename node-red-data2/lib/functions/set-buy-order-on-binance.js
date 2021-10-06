// name: set buy order on binance
// outputs: 1
// initialize: // Code added here will be run once\n// whenever the node is started.\n
// finalize: // Code added here will be run when the\n// node is being stopped or re-deployed.\n
// info: 

function parseApiError(error) {
  if (error.body) {
    try {
      var resp = JSON.parse(error.body);
      return resp.msg;
    } catch (error) {/* pass thru */}
  }
  return "Unknown error. Status code: "+error.statsCode;
}

let LBinance = global.get('gBinance');
//node.warn(LBinance);
let key = global.get('key');
let secret = global.get('secret');


let binance = new LBinance().options({
	APIKEY: key,
	APISECRET: secret,
	useServerTime: true,
	adjustForTimeDifference: true 
});




let moneta = msg.payload.moneta;
let quantity = Number(msg.payload.quantity);
let price = Number(msg.payload.price);
node.warn(moneta+" set buy order q = "+quantity+" p = "+price);




binance.useServerTime(function() {
    binance.buy(moneta, quantity, price, {type:'LIMIT'}, (err, resp) => {
 // console.info("Limit Buy response", response);
 // console.info("order id: " + response.orderId);
    if (err) {
        var errorMsg = parseApiError(err) + ", moneta:" + moneta;
        node.error(errorMsg, msg);

        msg.err = err;
        node.status({fill: "red", shape: "ring", text: errorMsg});
        
        node.send(msg);
        //return [msg, null];
    
    }
    if (resp) {
        msg.orderid = resp.orderId;
        msg.resp = resp;
        node.status({fill: "green", shape: "ring", text: resp.orderId});
        
        node.send(msg);
       // return [null,msg];
                
    }
    //node.status({}); //clear status message
});
	
});