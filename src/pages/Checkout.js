import {
  PayPalScriptProvider,
  PayPalButtons,
  BraintreePayPalButtons,
} from "@paypal/react-paypal-js";

export default function Checkout(props) {
  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AVXlidyETyUadoj9PbM5MJljo0ueCoOGcrWk3ZTNHajD3bqJDFVMCTcmJQyUTdE8ox0kiyYNZp7uoqQB",
      }}
    >
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: props.amount,
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            console.log("details: ", details);
            const id = details.purchase_units[0].payments.captures[0].id;
            console.log("id:" , id)
            props.sendCrypto(id)
            // alert(`Transaction completed by ${name}`);
          });
        }}
      />
    </PayPalScriptProvider>
    // <PayPalScriptProvider
    //   options={{
    //     "client-id":
    //       "AXZTzO4w2TCZ-k8tdlswpXfTTzDaOpiyOJNaXfFkgLUjfTCG78FNK2dVqfss_XmvZmBWtPcRWpmaE-k9",
    //   }}
    // >
    //   <PayPalButtons
    //     createOrder={(data, actions) => {
    //       return actions.order.create({
    //         flow: "checkout",
    //         amount: "10.0",
    //         currency: "USD",
    //         intent: "capture",
    //       });
    //     }}
    //     onApprove={(data, actions) => {
    //       return actions.order.capture().then((details) => {
    //         const name = details.payer.name.given_name;
    //         alert(`Transaction completed by ${name}`);
    //       });
    //     }}
    //   />
    // </PayPalScriptProvider>
  );
}
