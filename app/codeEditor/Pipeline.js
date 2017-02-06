class Pipeline {
	constructor(stages) {
		this.stages = stages;
	}
	reversePipeline() {
		this.stages = this.stages.reverse();
		return this.stages;
	}
	passValThrough(value) {
		return this.stages.reduce((accumulator, currentFnctn) => currentFnctn(accumulator), value);
	}
}
module.exports = Pipeline;
