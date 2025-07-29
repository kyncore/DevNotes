<?php

class WhippedCreamDecorator extends CoffeeDecorator
{
    public function getCost(): int
    {
        return $this->coffee->getCost() + 5;
    }

    public function getDescription(): string
    {
        return $this->coffee->getDescription() . ', whipped cream';
    }
}
