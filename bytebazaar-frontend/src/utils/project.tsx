export const formatingProjectStatus = (status) => {
    if (status === 'inProgress') return "In Progress";
    if (status === 'completed') return "Completed";
    if (status === 'planning') return "Planning";
}

export const formatingProjectCategory = (category) => {
    if(category === 'webDev') return "Web Development";
    if(category === 'mobileApp') return "Mobile App";
    if(category === 'ui/ux') return "UI/UX";
    if(category === 'dataAnalysis') return "Data Analysis";

}