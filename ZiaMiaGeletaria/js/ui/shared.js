import { getItems } from "../business.js";
import { renderItemList } from "./list.js";

const ROOT_ELEMENT = "main";

const getRoot = () => document.querySelector(ROOT_ELEMENT);

const emptyRoot = () => {
    getRoot().innerHTML = "";
};

const insertIntoDom = element => {
    emptyRoot();
    getRoot().append(element);
};

const renderHome = () => {
    const content = `
<section>
                <p>
                    Carrot cake marzipan pie tiramisu chupa chups dessert chocolate bar toffee pastry. Donut topping marshmallow danish chocolate bar. Oat cake donut soufflé shortbread oat cake soufflé lollipop. <a href="#">Bear claw
            gummies
            carrot</a> cake chocolate chocolate chocolate cake. Jelly-o gingerbread cupcake sugar plum jujubes. Halvah danish cookie danish pie. Fruitcake chupa chups fruitcake shortbread danish muffin biscuit.
                </p>
                <img src="img/icecream.jpg" alt="icecream" />
                <p>
                    Pudding oat cake cake gingerbread biscuit wafer dragée macaroon sugar plum. Oat cake liquorice liquorice brownie shortbread sesame snaps chocolate cake jelly-o apple pie. <a href="#">Tiramisu sesame snaps</a> jelly-o biscuit donut
                    soufflé carrot cake jelly beans dessert. Dessert chupa chups chocolate bar cake chocolate sweet roll tiramisu sweet roll marzipan. Jelly-o cheesecake gingerbread brownie shortbread macaroon gummi bears cotton candy oat cake. Marzipan
                    pastry cheesecake pudding lemon drops. Pastry tart toffee biscuit jujubes lemon drops. Dragée toffee dragée chupa chups chocolate bar tootsie roll jelly beans. Marzipan bear claw candy canes tart carrot cake powder tart. Jelly beans
                    cake tootsie roll cookie oat cake cupcake cake chocolate cake.
                </p>

                <p>
                    Chupa chups tiramisu gummi bears topping topping. <a href="#">Cake oat cake chupa chups jujubes topping.</a> Pie toffee halvah wafer biscuit cotton candy chocolate cake. Oat cake marshmallow halvah cupcake dessert gummi bears. Pudding
                    jujubes candy canes gummi bears marshmallow. Liquorice cheesecake macaroon jelly beans croissant. Cake sweet icing candy canes tart sweet roll sesame snaps pie. Bonbon gingerbread lemon drops oat cake soufflé pastry chocolate cake
                    sweet roll liquorice.
                </p>
            </section>
            <section>
                <img src="img/icecream2.jpg" alt="more icecream" />
            </section>`;

    const div = document.createElement("div");
    div.innerHTML = content;
    insertIntoDom(div);
};

const renderList = async(itemType, errors = []) => {
    renderItemList(await getItems(itemType), itemType, errors);
};

const renderError = error => {
    const li = document.createElement("li");
    li.textContent = error;
    return li;
};

const renderErrors = errors => {
    const ul = document.createElement("ul");
    ul.classList.add("errors");
    for (let error of errors) {
        ul.append(renderError(error));
    }
    return ul;
};

export { insertIntoDom, getRoot, renderList, renderHome, renderErrors };