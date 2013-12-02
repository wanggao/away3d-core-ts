///<reference path="../../_definitions.ts"/>

module away.animators
{
	import AssetType = away.library.AssetType;

	/**
	 * A collection of pose objects, determining the pose for an entire skeleton.
	 * The <code>jointPoses</code> vector object corresponds to a skeleton's <code>joints</code> vector object, however, there is no
	 * reference to a skeleton's instance, since several skeletons can be influenced by the same pose (eg: animation
	 * clips are added to any animator with a valid skeleton)
	 *
	 * @see away.animators.Skeleton
	 * @see away.animators.JointPose
	 */
	export class SkeletonPose extends away.library.NamedAssetBase implements away.library.IAsset
	{
		/**
		 * A flat list of pose objects that comprise the skeleton pose. The pose indices correspond to the target skeleton's joint indices.
		 *
		 * @see away.animators.Skeleton#joints
		 */
		public jointPoses:Array<JointPose>;

		/**
		 * The total number of joint poses in the skeleton pose.
		 */
		public get numJointPoses():number /*uint*/
		{
			return this.jointPoses.length;
		}

		/**
		 * Creates a new <code>SkeletonPose</code> object.
		 */
			constructor()
		{
			super();

			this.jointPoses = new Array<JointPose>();
		}

		/**
		 * @inheritDoc
		 */
		public get assetType():string
		{
			return AssetType.SKELETON_POSE;
		}

		/**
		 * Returns the joint pose object with the given joint name, otherwise returns a null object.
		 *
		 * @param jointName The name of the joint object whose pose is to be found.
		 * @return The pose object with the given joint name.
		 */
		public jointPoseFromName(jointName:string):JointPose
		{
			var jointPoseIndex:number /*int*/ = this.jointPoseIndexFromName(jointName);
			if (jointPoseIndex != -1)
				return this.jointPoses[jointPoseIndex]; else
				return null;
		}

		/**
		 * Returns the pose index, given the joint name. -1 is returned if the joint name is not found in the pose.
		 *
		 * @param The name of the joint object whose pose is to be found.
		 * @return The index of the pose object in the jointPoses Array
		 *
		 * @see #jointPoses
		 */
		public jointPoseIndexFromName(jointName:string):number /*int*/
		{
			// this is implemented as a linear search, rather than a possibly
			// more optimal method (Dictionary lookup, for example) because:
			// a) it is assumed that it will be called once for each joint
			// b) it is assumed that it will be called only during load, and not during main loop
			// c) maintaining a dictionary (for safety) would dictate an interface to access JointPoses,
			//    rather than direct array access.  this would be sub-optimal.
			var jointPoseIndex:number /*int*/;
			var jointPose:JointPose;
			for (var i:number /*uint*/; i < this.jointPoses.length; i++) {
				jointPose = this.jointPoses[i];
				if (jointPose.name == jointName)
					return jointPoseIndex;
				jointPoseIndex++;
			}

			return -1;
		}

		/**
		 * Creates a copy of the <code>SkeletonPose</code> object, with a dulpicate of its component joint poses.
		 *
		 * @return SkeletonPose
		 */
		public clone():SkeletonPose
		{
			var clone:SkeletonPose = new SkeletonPose();
			var numJointPoses:number /*uint*/ = this.jointPoses.length;
			for (var i:number /*uint*/ = 0; i < numJointPoses; i++) {
				var cloneJointPose:JointPose = new JointPose();
				var thisJointPose:JointPose = this.jointPoses[i];
				cloneJointPose.name = thisJointPose.name;
				cloneJointPose.copyFrom(thisJointPose);
				clone.jointPoses[i] = cloneJointPose;
			}
			return clone;
		}

		/**
		 * @inheritDoc
		 */
		public dispose()
		{
			this.jointPoses.length = 0;
		}
	}
}