#!/bin/bash

# Script to apply consistent responsive design patterns to all EJS view files

echo "Applying responsive design updates to all view files..."

# Function to update header patterns
update_headers() {
    find views -name "*.ejs" -type f -exec sed -i '
        s/text-4xl font-bold mb-4/text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 lg:mb-4/g;
        s/text-3xl font-bold/text-xl sm:text-2xl lg:text-3xl font-bold/g;
        s/text-2xl font-bold/text-lg lg:text-2xl font-bold/g;
        s/text-xl font-bold/text-lg lg:text-xl font-bold/g;
        s/text-lg italic/text-sm sm:text-base lg:text-lg italic/g;
        s/mb-12 relative/mb-8 lg:mb-12 relative/g;
        s/mb-16 relative/mb-8 lg:mb-16 relative/g;
        s/px-8 inline-block/px-4 sm:px-6 lg:px-8 inline-block/g
    ' {} \;
}

# Function to update spacing patterns  
update_spacing() {
    find views -name "*.ejs" -type f -exec sed -i '
        s/mb-12/mb-8 lg:mb-12/g;
        s/mb-16/mb-8 lg:mb-16/g;
        s/p-8/p-4 sm:p-6 lg:p-8/g;
        s/px-8 py-5/px-4 sm:px-6 lg:px-8 py-4 lg:py-5/g;
        s/px-6 py-4/px-4 lg:px-6 py-3 lg:py-4/g;
        s/gap-8/gap-4 sm:gap-6 lg:gap-8/g;
        s/gap-6/gap-3 sm:gap-4 lg:gap-6/g
    ' {} \;
}

# Function to update grid patterns
update_grids() {
    find views -name "*.ejs" -type f -exec sed -i '
        s/grid-cols-1 md:grid-cols-2/grid-cols-1 lg:grid-cols-2/g;
        s/grid-cols-1 md:grid-cols-3/grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/g;
        s/grid-cols-1 md:grid-cols-4/grid-cols-2 lg:grid-cols-4/g
    ' {} \;
}

# Function to update button and form patterns
update_interactive() {
    find views -name "*.ejs" -type f -exec sed -i '
        s/px-6 py-3/px-4 lg:px-6 py-2 lg:py-3/g;
        s/px-4 py-3/px-3 lg:px-4 py-2 lg:py-3/g;
        s/px-8 py-4/px-6 lg:px-8 py-3 lg:py-4/g;
        s/rounded-xl/rounded-lg lg:rounded-xl/g;
        s/rounded-2xl/rounded-xl lg:rounded-2xl/g
    ' {} \;
}

# Function to update table responsive patterns
update_tables() {
    find views -name "*.ejs" -type f -exec sed -i '
        s/py-5 px-6/py-3 lg:py-5 px-3 lg:px-6/g;
        s/py-5 px-4/py-3 lg:py-5 px-2 lg:px-4/g;
        s/py-6 px-6/py-4 lg:py-6 px-3 lg:px-6/g;
        s/py-6 px-4/py-4 lg:py-6 px-2 lg:px-4/g
    ' {} \;
}

# Function to update icon sizes
update_icons() {
    find views -name "*.ejs" -type f -exec sed -i '
        s/text-6xl/text-4xl lg:text-6xl/g;
        s/text-5xl/text-3xl lg:text-5xl/g;
        s/text-4xl/text-2xl lg:text-4xl/g;
        s/mr-4/mr-2 lg:mr-4/g;
        s/ml-4/ml-2 lg:ml-4/g
    ' {} \;
}

# Run all updates
echo "Updating headers..."
update_headers

echo "Updating spacing..."
update_spacing

echo "Updating grids..."
update_grids

echo "Updating interactive elements..."
update_interactive

echo "Updating tables..."
update_tables

echo "Updating icons..."
update_icons

echo "✅ Responsive design updates completed!"
echo "All view files have been updated with responsive design patterns for mobile, tablet, and desktop screens."