<?php

require_once 'Coffee.php';
require_once 'SimpleCoffee.php';
require_once 'CoffeeDecorator.php';
require_once 'MilkDecorator.php';
require_once 'SugarDecorator.php';
require_once 'WhippedCreamDecorator.php';

$coffee = new SimpleCoffee();
echo $coffee->getDescription() . ' costs ' . $coffee->getCost() . "\n";

$coffeeWithMilk = new MilkDecorator($coffee);
echo $coffeeWithMilk->getDescription() . ' costs ' . $coffeeWithMilk->getCost() . "\n";

$coffeeWithMilkAndSugar = new SugarDecorator($coffeeWithMilk);
echo $coffeeWithMilkAndSugar->getDescription() . ' costs ' . $coffeeWithMilkAndSugar->getCost() . "\n";

$fancyCoffee = new WhippedCreamDecorator(new SugarDecorator(new MilkDecorator(new SimpleCoffee())));
echo $fancyCoffee->getDescription() . ' costs ' . $fancyCoffee->getCost() . "\n";

