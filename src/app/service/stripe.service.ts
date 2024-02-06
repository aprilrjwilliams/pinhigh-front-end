import { Injectable } from "@angular/core";
import { Stripe } from "@stripe/stripe-js";
import { environment } from "../../environments/environment";

@Injectable({providedIn:"root"})
export class StripeService{

    stripePromise: Promise<Stripe>;
    

    constructor(){
        this.stripePromise = this.loadStripe();
    }

    private loadStripe(): Promise<Stripe>{
        return(window as any).Stripe(environment.stripeKey)
    }

    async redirectToCheckout(data: any): Promise<void> {
        console.log('data ', data)
        const stripe = await this.stripePromise;

        const response = await fetch(environment.apiUrl + "/api/create-checkout-session", {
            method: "POST", 
            headers:{
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const session = await response.json()

        console.log('session ', session)

        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        })

        if(result.error){
            console.error(result.error)
        }

    }
}