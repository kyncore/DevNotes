<?php

class SugarDecorator extends CoffeeDecorator
{
    public function getCost(): int
    {
        return $this->coffee->getCost() + 1;
    }

    public function getDescription(): string
    {
        return $this->coffee->getDescription() . ', sugar';
    }
}
