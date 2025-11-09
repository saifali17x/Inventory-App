#!/bin/bash

# Final mobile-specific enhancements for better UX on small screens

echo "Applying mobile-specific enhancements..."

# Add mobile-friendly navigation patterns
find views -name "*.ejs" -type f -exec sed -i '
    s/flex justify-between items-center/flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4/g;
    s/inline-flex items-center gap-3/inline-flex items-center justify-center gap-2 lg:gap-3/g;
    s/inline-flex items-center gap-2/inline-flex items-center justify-center gap-1 lg:gap-2/g
' {} \;

# Make tables more mobile-friendly with overflow scrolling
find views -name "*.ejs" -type f -exec sed -i '
    s/<div class="overflow-x-auto">/<div class="overflow-x-auto -mx-2 lg:mx-0">/g;
    s/w-full>/w-full min-w-full>/g
' {} \;

# Update action buttons to be more mobile-friendly
find views -name "*.ejs" -type f -exec sed -i '
    s/gap-3/gap-1 lg:gap-3/g;
    s/p-3/p-2 lg:p-3/g;
    s/text-sm/text-xs lg:text-sm/g
' {} \;

# Add responsive text sizing for better mobile readability
find views -name "*.ejs" -type f -exec sed -i '
    s/text-lg/text-base lg:text-lg/g;
    s/font-medium/font-medium text-sm lg:text-base/g
' {} \;

# Make empty states more compact on mobile
find views -name "*.ejs" -type f -exec sed -i '
    s/py-24/py-16 lg:py-24/g;
    s/py-20/py-12 lg:py-20/g;
    s/py-16/py-10 lg:py-16/g
' {} \;

echo "✅ Mobile-specific enhancements completed!"
echo "Added mobile-friendly navigation, table scrolling, button sizing, and text scaling."