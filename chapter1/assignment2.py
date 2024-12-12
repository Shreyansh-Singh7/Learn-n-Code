
import random

def randomfunction(max):
    if randomfunction.isdigit() and 1 <= int(max) <= 100
        return true
def main():
    target_number = random.randint(1, 100)
    guess = False
    guess_input = input("Guess a number between 1 and 100: ")
    guess_count = 0

    while not guess:
        if not randomfunction(guess_input):
            guess_input = input("I won't count this one. Please enter a number between 1 and 100: ")
            continue
        else:
            guess_count += 1
            guess_input = int(guess_input)

        if guess_input < target_number:
            guess_input = input("Too low. Guess again: ")
        elif guess_input > target_number:
            guess_input = input("Too high. Guess again: ")
        else:
            print("You guessed it in", guess_count, "guesses!")
            guess = True

main()