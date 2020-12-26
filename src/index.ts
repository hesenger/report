class Test {
    run(): String {
        return 'run';
    }

    toString(): String {
        return 'toString';
    }

    isFive(n: Number) {
        if (n % 1 !== 0)
            return false;

        return n === 5;
    }
}

export default Test;