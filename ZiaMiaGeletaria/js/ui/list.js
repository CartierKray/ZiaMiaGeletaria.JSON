import { insertIntoDom, renderErrors } from "./shared.js";
import { getCustomer } from "../business.js";

const renderItemProperty = (name, value) => {
    const li = document.createElement("li");
    let text;
    if (name === "name") {
        text = value;
    } else {
        text = `${name}: ${value}`;
    }
    li.innerText = text;

    return li;
};

const renderItemProperties = async item => {
    const ul = document.createElement("ul");
    ul.classList.add("item_properties");
    for (let [name, value] of Object.entries(item)) {
        if (name === "id") {
            continue;
        }
        if (name === "customerId") {
            name = "customer";
            // Better to find a single location for converting all ids.
            const id = parseInt(item.customerId);
            const customer = await getCustomer(id);
            value = customer.name;
        }
        if (name === "orderDescription") {
            name = "order description";
        }
        ul.append(renderItemProperty(name, value));
    }
    return ul;
};

const renderEditButton = (itemType, itemId) => {
    const button = document.createElement("input");
    button.type = "button";
    button.value = "Edit";
    button.classList.add("edit");
    button.dataset.itemType = itemType;
    button.dataset.itemId = itemId;
    return button;
};

const renderDeleteButton = (itemType, itemId) => {
    const button = document.createElement("input");
    button.type = "button";
    button.value = "Delete";
    button.classList.add("delete");
    button.dataset.itemType = itemType;
    button.dataset.itemId = itemId;
    return button;
};

const renderItem = async(item, itemType) => {
    const li = document.createElement("li");
    li.append(await renderItemProperties(item));
    li.append(renderEditButton(itemType, item.id));
    li.append(renderDeleteButton(itemType, item.id));
    return li;
};

const renderAddButton = itemType => {
    const li = document.createElement("li");

    const button = document.createElement("input");
    button.classList.add("add");
    button.dataset.itemType = itemType;
    button.type = "button";
    button.value = `Add new ${itemType.slice(0, itemType.length - 1)}`;

    li.append(button);
    return li;
};

const renderItemList = async(items, itemType, errors) => {
    // Contains both the list and a list of 0..n errors.
    const div = document.createElement("div");

    const ul = document.createElement("ul");
    ul.classList.add("items");
    ul.classList.add(itemType);
    ul.append(renderAddButton(itemType));
    for (let item of items) {
        ul.append(await renderItem(item, itemType));
    }

    div.append(renderErrors(errors));
    div.append(ul);

    insertIntoDom(div);
};

export { renderItemList };