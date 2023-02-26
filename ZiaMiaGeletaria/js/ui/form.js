import { getRoot } from "./shared.js";
import { insertIntoDom, renderErrors } from "./shared.js";
import { itemTypes, getCustomers, getOrderStatusList } from "../business.js";

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

const renderTextInputField = (name, value, readonly = false) => {
    const label = document.createElement("label");
    const span = document.createElement("span");
    let displayName = name;
    if (name === "orderDescription") {
        displayName = "Order Description";
    }

    span.innerText = capitalize(displayName);
    label.append(span);
    const input = document.createElement("input");
    input.readOnly = readonly;

    if (name === "date") {
        input.type = "date";
    } else if (name === "email") {
        input.type = "email";
    } else {
        input.type = "text";
    }
    input.value = value;
    input.name = name;
    label.append(input);
    return label;
};

const renderInvisibleInputField = (name, value) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.value = value;
    input.name = name;
    return input;
};

const renderCustomerSelect = async(name, value = "", readonly = false) => {
    const customers = await getCustomers();

    const label = document.createElement("label");
    const span = document.createElement("span");
    span.innerText = "Customer";
    label.append(span);

    const select = document.createElement("select");
    select.name = name;

    select.disabled = readonly;

    const option = document.createElement("option");
    option.textContent = "Select customer";
    option.value = "";
    select.append(option);

    for (const customer of customers) {
        const option = document.createElement("option");
        option.textContent = customer.name;
        option.value = customer.id;
        select.append(option);
    }
    select.value = value;

    label.append(select);
    return label;
};

const renderStatusDropdown = (name, value = "") => {
    const statusList = getOrderStatusList();

    const label = document.createElement("label");
    const span = document.createElement("span");
    span.innerText = capitalize(name);
    label.append(span);

    const select = document.createElement("select");
    select.name = name;

    const option = document.createElement("option");
    option.textContent = "Select order status";
    option.value = "";
    select.append(option);

    for (const status of statusList) {
        const option = document.createElement("option");
        option.textContent = status;
        option.value = status;
        select.append(option);
    }
    select.value = value;

    label.append(select);
    return label;
};

const renderForm = async(itemType, data, errors = []) => {
    // Three situations:
    // 1. fresh add: no data
    // 2. re-add (because of errors): data, but no id
    // 3. update
    let operation = "update";
    if (data === undefined) {
        operation = "add";
    }
    if (data && data.id === undefined) {
        // We could use optional chaining in the condition here.
        operation = "add";
    }

    const form = document.createElement("form");
    form.classList.add(itemType);

    if (errors.length > 0) {
        form.append(renderErrors(errors));
    }

    form.append(renderInvisibleInputField("type", itemType));

    const itemTypeFields = itemTypes[itemType];

    for (const fieldName of itemTypeFields) {
        const fieldValue = data ? data[fieldName] : "";

        // We can only update the status field of an order.
        let readonly = false;
        if (
            operation === "update" &&
            itemType === "orders" &&
            fieldName !== "order"
        ) {
            readonly = true;
        }

        if (fieldName === "id" && data.id !== undefined) {
            form.append(renderInvisibleInputField(fieldName, fieldValue));
        } else if (fieldName === "customerId") {
            // To be able to show a disabled select but still get the original value passed along we will need to
            // add a hidden field with the same name and value.
            if (!readonly) {
                form.append(
                    await renderCustomerSelect(fieldName, fieldValue, readonly)
                );
            } else {
                form.append(await renderCustomerSelect("", fieldValue, readonly));
                form.append(renderInvisibleInputField(fieldName, fieldValue));
            }
        } else if (fieldName === "status") {
            form.append(renderStatusDropdown(fieldName, fieldValue));
        } else {
            form.append(renderTextInputField(fieldName, fieldValue, readonly));
        }
    }
    // For update forms we need this
    if (operation === "update") {
        form.append(renderInvisibleInputField("id", data.id));
    }
    const submit = document.createElement("input");
    submit.type = "submit";
    submit.value = operation;
    form.append(submit);

    insertIntoDom(form);
};

const parseNumber = value => {
    const converted = Number(value);
    if (Number.isNaN(converted)) {
        return value; // Actual validation is done in business.js
    } else {
        return converted;
    }
};

const getDataFromRenderedForm = () => {
    const formData = new FormData(getRoot().querySelector("form"));

    const data = {};
    for (let [name, value] of formData.entries()) {
        // Remove whitespace from all fields.

        value = value.toString().trim();
        // Parse numerical fields.
        if (name === "price") {
            value = parseNumber(value);
        }
        // Always simple-parse id
        if (name === "id" || name === "customerId") {
            value = parseInt(value);
        }
        data[name] = value;
    }
    return data;
};

export { getDataFromRenderedForm, renderForm };