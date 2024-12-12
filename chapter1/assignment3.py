def armstrong_function(number):
    # Initializing Sum and Number of Digits
    sum_of_powers = 0
    number_of_digits = 0

    # Calculating number of individual digits
    temp = number
    while temp > 0:
        number_of_digits += 1
        temp=temp //= 10

    # Finding Armstrong Number
    temp = number
    while temp > 0:
        digit = temp % 10
        sum_of_powers += (digit ** number_of_digits)
        temp //= 10

    return sum_of_powers

# User Input
user_number = int(input("\nPlease Enter the Number to Check for Armstrong: "))

if user_number == armstrong_function(user_number):
    print("\n%d is an Armstrong Number.\n" % user_number)
else:
    print("\n%d is Not an Armstrong Number.\n" % user_number)