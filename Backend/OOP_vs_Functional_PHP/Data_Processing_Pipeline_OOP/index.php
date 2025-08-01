<?php

class UserDataProcessor
{
    private array $users;
    private array $processedData = [];

    public function __construct(array $users)
    {
        $this->users = $users;
        $this->processedData = $users; // Start with the full list
    }

    /**
     * Filters out users who are not active.
     * This method mutates the internal $processedData state.
     */
    public function filterInactive(): self
    {
        $activeUsers = [];
        foreach ($this->processedData as $user) {
            if ($user['active']) {
                $activeUsers[] = $user;
            }
        }
        $this->processedData = $activeUsers;
        return $this; // Return self for method chaining
    }

    /**
     * Formats the names of the users to "Last, First".
     * This also mutates the internal state.
     */
    public function formatUserNames(): self
    {
        $formattedUsers = [];
        foreach ($this->processedData as $user) {
            $user['fullName'] = $user['lastName'] . ', ' . $user['firstName'];
            $formattedUsers[] = $user;
        }
        $this->processedData = $formattedUsers;
        return $this;
    }

    /**
     * Returns the final processed data.
     */
    public function getResult(): array
    {
        return $this->processedData;
    }
}

// --- Usage ---

$users = [
    ['id' => 1, 'firstName' => 'Alice', 'lastName' => 'Smith', 'active' => true],
    ['id' => 2, 'firstName' => 'Bob', 'lastName' => 'Johnson', 'active' => false],
    ['id' => 3, 'firstName' => 'Charlie', 'lastName' => 'Brown', 'active' => true],
];

echo "OOP Data Processing Pipeline Example\n";
echo "----------------------------------\n";

// Create an object to process the data.
$processor = new UserDataProcessor($users);

// Chain methods to perform the pipeline steps.
$result = $processor
    ->filterInactive()
    ->formatUserNames()
    ->getResult();

echo "Processed user data:\n";
print_r($result);
