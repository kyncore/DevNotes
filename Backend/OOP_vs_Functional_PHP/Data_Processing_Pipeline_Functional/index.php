<?php

// --- Pure Functions ---

/**
 * Filters an array of users to include only active ones.
 * @param array $users
 * @return array
 */
function filterInactiveUsers(array $users): array
{
    // array_filter is a higher-order function. It takes a function as an argument.
    return array_filter($users, fn($user) => $user['active']);
}

/**
 * Maps an array of users to format their names.
 * @param array $users
 * @return array
 */
function formatUserNames(array $users): array
{
    // array_map is also a higher-order function.
    return array_map(function ($user) {
        $user['fullName'] = $user['lastName'] . ', ' . $user['firstName'];
        return $user;
    }, $users);
}

// --- Usage ---

$users = [
    ['id' => 1, 'firstName' => 'Alice', 'lastName' => 'Smith', 'active' => true],
    ['id' => 2, 'firstName' => 'Bob', 'lastName' => 'Johnson', 'active' => false],
    ['id' => 3, 'firstName' => 'Charlie', 'lastName' => 'Brown', 'active' => true],
];

echo "Functional Data Processing Pipeline Example\n";
echo "-----------------------------------------\n";

// We can define our pipeline as a composition of functions.
// This makes the flow of data very clear: users -> filter -> format.
$pipeline = fn(array $data) => formatUserNames(filterInactiveUsers($data));

$result = $pipeline($users);

// --- Alternative: Direct Chaining ---
// You can also do this directly without the $pipeline variable.
// This is a more common sight in functional-style code.
$resultChained = array_map(
    function ($user) {
        $user['fullName'] = $user['lastName'] . ', ' . $user['firstName'];
        return $user;
    },
    array_filter($users, fn($user) => $user['active'])
);


echo "Processed user data (using pipeline variable):\n";
print_r($result);

echo "\nProcessed user data (using direct chaining):\n";
print_r($resultChained);

echo "\nOriginal user data is unchanged:\n";
print_r($users);

