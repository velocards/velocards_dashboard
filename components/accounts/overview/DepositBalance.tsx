"use client";

const DepositBalance = () => {
  return (
    <div className="box col-span-12 md:col-span-5 xxl:col-span-4">
      <div className="flex flex-wrap justify-between items-center gap-3 pb-4 lg:pb-6 mb-4 lg:mb-6 bb-dashed">
        <p className="font-medium">Tier Info</p>
      </div>
      
      <div className="grid grid-cols-2 gap-0 mb-6">
        {/* Left Half - Current Tier */}
        <div className="pr-4 border-r-2 border-dashed border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-600">Current Tier</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Silver</span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission:</span>
                    <span className="font-medium">2.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card Creation:</span>
                    <span className="font-medium">$5.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card Renewal:</span>
                    <span className="font-medium">$2.00/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Limit:</span>
                    <span className="font-medium">$10,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Half - Next Tier */}
        <div className="pl-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-600">Next Tier</span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">Gold</span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-dashed border-yellow-300">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission:</span>
                    <span className="font-medium text-green-600">1.8% <span className="text-xs">(-0.7%)</span></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card Creation:</span>
                    <span className="font-medium text-green-600">$3.00 <span className="text-xs">(-$2)</span></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card Renewal:</span>
                    <span className="font-medium text-green-600">$1.50/mo <span className="text-xs">(-$0.50)</span></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Limit:</span>
                    <span className="font-medium text-green-600">$25,000 <span className="text-xs">(+$15k)</span></span>
                  </div>
                </div>
              </div>
              
              {/* Benefits */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 border border-dashed border-green-300">
                <p className="text-xs text-green-700 font-medium text-center">Save 28% on fees with Gold!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Bar - At bottom */}
      <div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span>Progress to Gold</span>
            <span>$1,476 / $5,000</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full" style={{width: '29.5%'}}></div>
          </div>
          <div className="text-[10px] text-gray-500">$3,524 more to unlock Gold</div>
        </div>
      </div>
    </div>
  );
};

export default DepositBalance;