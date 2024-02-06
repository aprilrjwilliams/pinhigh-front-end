import { Component } from '@angular/core';
import { StripeService } from '../../service/stripe.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [],
  providers: [],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css'
})
export class PaymentPageComponent {

  constructor(private stripeService: StripeService){}

  //recurring priceId (mode = subscription)
  //one-time priceId (mode = payment)

  private subPriceId = 'price_1OdwGEEutSUlLZ7PmpALtO87';
  private paymentPriceId = 'price_1OdacKEutSUlLZ7PNMLGF8hv';

  public divClicked = '';


  public checkoutModel = {
    priceId: '',
    mode: ''
  }



  async redirectToCheckout() {

    this.stripeService.redirectToCheckout(this.checkoutModel);
  }

  setCheckoutInfo(mode: string): void{

    this.divClicked = mode;

    if (mode == 'subscription'){
      this.checkoutModel = {
        priceId: this.subPriceId,
        mode: mode
      }
    } else if(mode == 'payment'){
      this.checkoutModel = {
        priceId: this.paymentPriceId,
        mode: mode
      }
    }

    console.log('checkoutModel ', this.checkoutModel)
    
  }

}
