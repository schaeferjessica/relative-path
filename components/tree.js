import { dataNext, dataReact, dataVue, dataJS, dataAngular } from '../pages/api/data';
import dynamic from 'next/dynamic';
import {useState, useEffect} from "react"

const DynamicFileTreeImport = dynamic(() => import('react-folder-tree'), {
  ssr: false,
});

const BasicTree = (props) => {

  const [dataTree, setDataTree] = useState(dataVue);
  
  const createCheckboxes = () => {
    document.querySelectorAll('.FolderOpenIcon, .FolderIcon').forEach(item => {
      const checkbox = item.parentElement.parentElement.querySelector('.checkboxDOM');
      checkbox.disabled = true;
      checkbox.setAttribute('hidden', 'true')
    });

    const treeNodes = document.querySelectorAll('.TreeNode');
    treeNodes.forEach(item => {
      const checkboxDiv = item.querySelector('.CheckBox')
      const checkboxSpan = item.querySelector('.checkbox-span')

      if (!checkboxSpan) {
        const span = document.createElement('span');
        span.classList.add('checkbox-span');
        checkboxDiv.appendChild(span);
      } 
    })
  }

  const handlePathColorHighlight = (element, className, isChecked) => {
    if (element){
      if (isChecked) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    }
  }

  const handleColorCheckboxState = (isChecked) => {
    console.log(isChecked)
    const selectedPathFrom = document.querySelector('.selectedPath--from');
    const selectedPathTo = document.querySelector('.selectedPath--to');
    const treeNodes = document.querySelectorAll('.TreeNode');

    handlePathColorHighlight(selectedPathFrom, 'fileNameCheckedFrom', isChecked);
    handlePathColorHighlight(selectedPathTo, 'fileNameCheckedTo', isChecked);
    console.log(treeNodes)
    treeNodes.forEach(item => {
      const checkbox = item.querySelector('.checkboxDOM')
      
      // if (isChecked) {
      //   checkbox.classList.add('checkbox-color--from');
      // } else {
      //   checkbox.classList.remove('checkbox-color--from');
      // }
    })

    localStorage.setItem('relative-path-checkbox-color', isChecked);
  }

  const setupTree = () => {
    const colorCheckboxIsActive = localStorage.getItem('relative-path-checkbox-color');
    if (colorCheckboxIsActive !== 'undefined') {
      handleColorCheckboxState(colorCheckboxIsActive === 'true')
    }

    const checkboxColor = document.querySelector('.checkbox-color-highlight')
    checkboxColor.addEventListener('change', () => {
      handleColorCheckboxState(checkboxColor.checked);
    })
  }

  const onTreeStateChange = (state, event) => {
    
    if (state.setupDone == undefined){
      setupTree()
      state.setupDone = true
    }

    createCheckboxes();

    const getChecked = (branch, path) => {
      let checkedElements = []

      let branchPath = path + '/' + branch.name

      if(branch.hasOwnProperty('isOpen')) {
        branch.children.forEach((child,i) => {
          checkedElements = checkedElements.concat(getChecked(child, branchPath))
        })
      } else if(branch.checked == 1) {
          checkedElements.push({
            path: branchPath,
            el: branch
          })
      }
      return checkedElements
    }

    //reseting collors
    let checkedEl = getChecked(state, '')

    let treeNodes = document.querySelectorAll('.TreeNode')

    if (state.firstEl != undefined) {
      treeNodes[state.firstEl.el._id].classList.remove('checkbox-color--from');
    }
    if (state.secondEl != undefined) {
      treeNodes[state.secondEl.el._id].classList.remove('checkbox-color--to');
    }

    if (checkedEl.length == 0){
      state.firstEl = undefined
    } else if(checkedEl.length == 1) {
      state.firstEl = checkedEl[0]
      state.secondEl = undefined
    } else if (checkedEl.length == 2) {
      if (state.firstEl.path == checkedEl[0].path) {
        state.secondEl = checkedEl[1]
      } else {
        state.secondEl = checkedEl[0]
      }
    } else if (checkedEl.length > 2){
      state.firstEl.el.checked = 0
      state.secondEl.el.checked = 0
      if (state.firstEl.path == checkedEl[0].path && state.secondEl.path == checkedEl[1].path ){
        state.firstEl = checkedEl[2]
      } else if (state.firstEl.path == checkedEl[1].path && state.secondEl.path == checkedEl[0].path ){
        state.firstEl = checkedEl[2]
      } else if (state.firstEl.path == checkedEl[0].path && state.secondEl.path == checkedEl[2].path ){
        state.firstEl = checkedEl[1]
      } else if (state.firstEl.path == checkedEl[2].path && state.secondEl.path == checkedEl[0].path ){
        state.firstEl = checkedEl[1]
      } else if (state.firstEl.path == checkedEl[1].path && state.secondEl.path == checkedEl[2].path ){
        state.firstEl = checkedEl[0]
      } else if (state.firstEl.path == checkedEl[2].path && state.secondEl.path == checkedEl[1].path ){
        state.firstEl = checkedEl[0]
      }
      state.secondEl = undefined
    }

    //setting colors
    if (state.firstEl != undefined) {
      treeNodes[state.firstEl.el._id].classList.add('checkbox-color--from');
    }
    if (state.secondEl != undefined) {
      treeNodes[state.secondEl.el._id].classList.add('checkbox-color--to');
    }

    let from = state.firstEl
    if (from == null) {
      from = ''
    } else {
      from = state.firstEl.path
    }
    let to = state.secondEl
    if (to == null) {
      to = ''
    } else {
      to = state.secondEl.path
    }
  
    function computePath(from, to) {

      let fromParts = from.split('/');
      fromParts.shift();

      let toParts = to.split('/');
      toParts.shift();

      let extract = [];
      let remaining = [];

      let nReturn = 0;

      for (let i = 0; i < fromParts.length; i++) {
        let e = fromParts[i];
        let x = toParts[i];
        if (e == x) {
          extract.push(e);
        } else {
          nReturn = fromParts.length - i - 1;
          remaining = toParts.slice(i);
          break;
        }
      }

      let path = '';

      if (nReturn > 0) {
        for (let i = 0; i < nReturn; i++) {
          path += '../';
        }
      } else {
        path += './';
      }

      return path += remaining.join('/');
    }

    //Defining the values of 'from, to and path' according the a function that gets all the checked elements of an object
    //Adding those values to the function setPathObj

    props.setPathObj({
      from: from,
      to: to,
      path: computePath(from, to)
    })
  }

  useEffect( () => { 
    const dataTreeOptions = [ dataNext, dataReact, dataVue, dataJS, dataAngular ]

    const getNextDataTree = () => {
      let nextDataTree = dataTreeOptions.shift()
      dataTreeOptions.push(nextDataTree)
      return nextDataTree
    }
    
    document.querySelector('.random-tree-data').addEventListener('click', () => {
      const dataTree = getNextDataTree()
      setDataTree(dataTree)
    });
  }, [])
  
  return (
    <DynamicFileTreeImport data={dataTree} onChange={onTreeStateChange}/>
  );
};

export default BasicTree;
