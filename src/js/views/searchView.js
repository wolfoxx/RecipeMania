/*jshint esversion: 6 */
/*jshint esversion: 8 */

import { elements } from './base';

export const getInput = ()=> elements.searchInput.value;

export const clearInput=() => {
    elements.searchInput.value='';
};
export const clearResults=() => {
        elements.searchResList.innerHTML='';
        elements.searchResPages.innerHTML='';
};

export const highlightedSelected=id=>{
    const resultsArr=Array.from(document.querySelectorAll('.results__link'));

    resultsArr.forEach(el=>{
        el.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle=(title,limit=20 ) => {
    const newTitle=[];
    if(title.length>limit){
        title.split(' ').reduce((acc,cur)=>{
            if(acc+cur.length<=limit){
                newTitle.push(cur);
            }
            return acc+ cur.length; 
        },0);

        return `${newTitle.join(' ')}...`;
    }
    return title;
};

const renderRecipe= recipe=>{
    const rec=recipe.recipe;
    const markup=
                 `<li>
                    <a class="results__link" href="#${encodeURIComponent(rec.uri)}">
                        <figure class="results__fig">
                            <img src="${rec.image}" alt="Test">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(rec.label)}</h4>
                            <p class="results__author">${rec.source}</p>
                        </div>
                    </a>
                </li>`;
                elements.searchResList.insertAdjacentHTML('beforeend',markup);
};

const createButton=(page,type)=>`
        <button class="btn-inline results__btn--${type}" data-goto=${type==='prev' ? page-1:page+1}>
            <svg class="search__icon">    
            <use href="img/icons.svg#icon-triangle-${type==='prev'?'left':'right'}"></use>
            </svg>
            <span>Page ${type==='prev' ? page-1: page+1}</span>
        </button>   
`;

const renderButtons=(page,numResults,resPerPage) => {
    const pages=Math.ceil(numResults/resPerPage);

    let button;
    if (page===1 && pages>1){
        button=createButton(page,'next');
    }else if(page<pages){
        button=`
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}`;
    }
    else if(page===pages && pages>1){
        button=createButton(page,'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};

export const renderResults = (recipes, page=1, resPerPage=10) => {
    const begin=(page-1)*resPerPage;
    const end=page*resPerPage;
    recipes.slice(begin,end).forEach(renderRecipe);

    //pagination
    renderButtons(page,recipes.length,resPerPage);
};