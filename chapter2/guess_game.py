import random

def is_valid_guess(guess):

    return guess.isdigit() and 1 <= int(guess) <= 100

def get_guess():
    return input("Guess a number between 1 and 100: ")

def play_game():
    
    target_number = random.randint(1, 100)
    guess_count = 0
    guessed_correctly = False

    while not guessed_correctly:
        guess = get_guess()

        if not is_valid_guess(guess):
            print("I won't count this one. Please enter a number between 1 and 100.")
            continue

        guess_count += 1
        guess = int(guess)

        if guess < target_number:
            print("Too low. Guess again.")
        elif guess > target_number:
            print("Too high. Guess again.")
        else:
            print(f"You guessed it in {guess_count} guesses!")
            guessed_correctly = True


play_game()
