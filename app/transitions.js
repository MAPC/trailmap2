export default function(){
  this.transition(
    this.fromRoute('index'),
    this.toRoute('filters'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
};