<?php

require_once 'PaymentAdapter.php';

$paymentProvider = new PaymentProvider();
$paymentAdapter = new PaymentAdapter($paymentProvider);

$paymentAdapter->pay(100);
