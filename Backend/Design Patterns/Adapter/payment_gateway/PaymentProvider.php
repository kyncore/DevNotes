<?php

class PaymentProvider
{
    public function requestPayment($amount)
    {
        echo "Requesting payment of {$amount} from the payment provider.\n";
    }
}

