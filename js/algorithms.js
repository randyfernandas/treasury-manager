function linearSearch(data, keyword) {
    const searchKeyword = keyword.toLowerCase();

    for (let i = 0; i < data.length; i++) {
        const customerName = data[i].customer.toLowerCase();

        if (customerName.includes(searchKeyword)) {
            return data[i];
        }
    }

    return null;
}

function binarySearch(data, targetId) {
    let left = 0;
    let right = data.length - 1;

    while (left <= right) {
        const middle = Math.floor((left + right) / 2);

        if (data[middle].id === targetId) {
            return data[middle];
        }

        if (data[middle].id < targetId) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }

    return null;
}

function compareValues(a, b, field) {
    if (field === "amount") {
        return a.amount - b.amount;
    }

    if (field === "date") {
        return new Date(a.date) - new Date(b.date);
    }

    if (field === "customer") {
        return a.customer.localeCompare(b.customer);
    }

    return 0;
}

function bubbleSort(data, field, order = "asc") {
    const result = [...data];

    const direction = order === "asc" ? 1 : -1;

    for (let i = 0; i < result.length - 1; i++) {

        let swapped = false;

        for (let j = 0; j < result.length - i - 1; j++) {

            const comparison = compareValues(
                result[j],
                result[j + 1],
                field
            );

            if (comparison * direction > 0) {
                const temp = result[j];

                result[j] = result[j + 1];
                result[j + 1] = temp;

                swapped = true;
            }
        }

        if (!swapped) {
            break;
        }
    }

    return result;
}

function mergeSort(data, field, order = "asc") {
    const direction = order === "asc" ? 1 : -1;

    function merge(left, right) {
        const result = [];

        let leftIndex = 0;
        let rightIndex = 0;

        while (
            leftIndex < left.length &&
            rightIndex < right.length
        ) {
            const comparison = compareValues(
                left[leftIndex],
                right[rightIndex],
                field
            );

            if (comparison * direction <= 0) {
                result.push(left[leftIndex]);
                leftIndex++;
            } else {
                result.push(right[rightIndex]);
                rightIndex++;
            }
        }

        return result.concat(
            left.slice(leftIndex),
            right.slice(rightIndex)
        );
    }

    function divide(array) {
        if (array.length <= 1) {
            return array;
        }

        const middle = Math.floor(array.length / 2);

        const left = divide(array.slice(0, middle));
        const right = divide(array.slice(middle));

        return merge(left, right);
    }

    return divide([...data]);
}
