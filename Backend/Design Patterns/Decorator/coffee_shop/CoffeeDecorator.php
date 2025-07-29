<?php

abstract class CoffeeDecorator implements Coffee
{
    protected $coffee;

    public function __construct(Coffee $coffee)
    {
        $this->coffee = $coffee;
    }

    public function getCost(): int
    {
        return $this->coffee->getCost();
    }

    public function getDescription(): string
    {
        return $this->coffee->getDescription();
    }
}
