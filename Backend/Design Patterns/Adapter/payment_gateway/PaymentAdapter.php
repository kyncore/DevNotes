<?php

require_once 'PaymentProvider.php';

interface PaymentInterface
{
    public function pay($amount);
}

class PaymentAdapter implements PaymentInterface
{
    private $paymentProvider;

    public function __construct(PaymentProvider $paymentProvider)
    {
        $this->paymentProvider = $paymentProvider;
    }

    public function pay($amount)
    {
        $this->paymentProvider->requestPayment($amount);
    }
}
